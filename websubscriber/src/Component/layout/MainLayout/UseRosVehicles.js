import { useEffect, useState, useRef } from "react";
import { publishBinary } from "../../../binaryStreamBus";

// 중계 서버 주소는 환경변수(REACT_APP_RELAY_WS_URL)로 주입한다.
// 미설정 시 기존 배포 동작을 유지하기 위해 기본값으로 fallback.
const RELAY_WS_URL =
    process.env.REACT_APP_RELAY_WS_URL || "ws://203.250.32.54:8080";

const PERSISTENT_TOPICS = new Set(["/ublox_gps_node/fix"]);

export default function UseRosVehicles() {
    const [vehiclesData, setVehiclesData] = useState({});
    const [vehicleList, setVehicleList] = useState([]);
    const [vehicleStatuses, setVehicleStatuses] = useState({}); // id -> { msAgo, receivedAt }
    const [bagFilesByVehicle, setBagFilesByVehicle] = useState({});
    const [bagPlayback, setBagPlayback] = useState({
        vehicleId: "",
        bagPath: "",
        bagName: "",
        state: "idle",
        currentTime: 0,
        duration: 0,
        rate: 1,
    });
    const wsRef = useRef(null);
    // 실제로 중계서버에 구독 요청을 보낸 토픽과, 화면과 무관하게 유지할 자동 구독을 분리한다.
    // 둘 다 Set이므로 topic_list를 반복 수신해도 구독 상태가 중복 누적되지 않는다.
    const subscribedRef = useRef(new Set());
    const persistentSubscribedRef = useRef(new Set());
    const latencyStatsRef = useRef({});
    const latencyResultsRef = useRef({});
    const pendingLoggingRequestsRef = useRef(new Map());
    const pendingBagRequestsRef = useRef(new Map());
    const subscribedTypesRef = useRef(new Map());     // topicKey -> msg_type (재구독용)
    const modeSubsRef = useRef({ real: [], bag: [] }); // 모드별 구독 스냅샷
    const currentDataModeRef = useRef("real");        // 현재 데이터 모드

    // 실험 시간
    const LATENCY_WARMUP_MS = 10_000;
    const LATENCY_MEASURE_MS = 60_000;

    const makeTopicKey = (vehicleId, topic) => `${vehicleId}::${topic}`;

    const makeRequestId = (prefix) =>
        `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const updateBagPlayback = (message) => {
        setBagPlayback((current) => {
            const nextState = message.state || message.playback_state || current.state;
            const isPlaying = message.is_playing;

            return {
                vehicleId: message.vehicle_id ?? current.vehicleId,
                bagPath: message.bag_path ?? current.bagPath,
                bagName: message.bag_name ?? message.name ?? current.bagName,
                state:
                    typeof isPlaying === "boolean"
                        ? (isPlaying ? "playing" : nextState === "idle" ? "idle" : "paused")
                        : nextState,
                currentTime:
                    message.current_time ??
                    message.position_seconds ??
                    message.position ??
                    current.currentTime,
                duration:
                    message.duration ??
                    message.duration_seconds ??
                    current.duration,
                rate: message.rate ?? message.playback_rate ?? current.rate,
            };
        });
    };

    useEffect(() => {
        if (wsRef.current) return;

        const ws = new WebSocket(RELAY_WS_URL);
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WS Connected");

            ws.send(JSON.stringify({
                type: "register",
                role: "user",
                user_id: "user_" + Date.now()
            }));

            ws.send(JSON.stringify({
                type: "vehicle_list"
            }));
        };

        // 바이너리 프레임 디코드
        // 레이아웃: [uint16 BE 헤더길이 H][H바이트 JSON 헤더][바이너리 페이로드]
        const handleBinaryFrame = (buf) => {
            const view = new DataView(buf);
            const headerLen = view.getUint16(0, false);

            let header;
            try {
                header = JSON.parse(
                    new TextDecoder().decode(new Uint8Array(buf, 2, headerLen))
                );
            } catch (e) {
                console.warn("bad binary header", e);
                return;
            }

            const vid = header.vehicle_id;
            const topic = header.topic;
            const payloadOffset = 2 + headerLen;

            // 포인트 클라우드: 고빈도라 React state를 거치지 않고 버스로 뷰어에 직접 전달
            // (setVehiclesData 미호출 → 전체 리렌더 없음)
            if (header.msg_type === "sensor_msgs/msg/PointCloud2") {
                // Float32Array는 4바이트 정렬이 필요하므로 페이로드를 새 버퍼로 복사
                const bytes = new Uint8Array(buf, payloadOffset);
                const aligned = new Uint8Array(bytes.length);
                aligned.set(bytes);
                publishBinary(vid, topic, {
                    __binary: "pointcloud",
                    points: new Float32Array(aligned.buffer),
                    count: header.count,
                    fields: header.fields,
                });
                return;
            }

            // 이미지: 상대적으로 저빈도라 기존 React state 경로 유지
            let value;
            if (header.msg_type === "sensor_msgs/msg/CompressedImage") {
                value = {
                    __binary: "image",
                    data: new Uint8Array(buf.slice(payloadOffset)),
                    format: header.format,
                };
            } else {
                return;
            }

            setVehiclesData((prev) => {
                const vehicle = prev[vid] || {};
                return {
                    ...prev,
                    [vid]: {
                        ...vehicle,
                        topicsData: { ...(vehicle.topicsData || {}), [topic]: value },
                        rawTopicsData: {
                            ...(vehicle.rawTopicsData || {}),
                            [topic]: { ...header, __binary: true },
                        },
                    },
                };
            });
        };

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                handleBinaryFrame(event.data);
                return;
            }

            const msg = JSON.parse(event.data);
            if (msg.type === "bag_list_response") {
                const pending = pendingBagRequestsRef.current.get(msg.request_id);
                if (pending) {
                    clearTimeout(pending.timeout);
                    pendingBagRequestsRef.current.delete(msg.request_id);
                }

                const files = Array.isArray(msg.bags)
                    ? msg.bags
                    : Array.isArray(msg.files)
                        ? msg.files
                        : [];
                const vehicleId = msg.vehicle_id || pending?.vehicleId || "";

                if (vehicleId) {
                    setBagFilesByVehicle((current) => ({
                        ...current,
                        [vehicleId]: files,
                    }));
                }

                if (msg.success === false) {
                    pending?.reject(new Error(msg.error || msg.message || "Bag list request failed"));
                } else {
                    pending?.resolve(files);
                }
                return;
            }

            if (msg.type === "bag_playback_response") {
                const pending = pendingBagRequestsRef.current.get(msg.request_id);
                if (pending) {
                    clearTimeout(pending.timeout);
                    pendingBagRequestsRef.current.delete(msg.request_id);
                }

                if (msg.success === false) {
                    pending?.reject(new Error(msg.error || msg.message || "Bag playback request failed"));
                } else {
                    const request = pending?.payload || {};
                    const fallbackState = {
                        open: "playing",
                        play: "playing",
                        pause: "paused",
                        stop: "idle",
                    }[request.action];
                    const openedBagPath = request.bag_path || "";

                    updateBagPlayback({
                        vehicle_id: request.vehicle_id,
                        bag_path: openedBagPath || undefined,
                        bag_name: openedBagPath
                            ? openedBagPath.split(/[\\/]/).filter(Boolean).pop()
                            : undefined,
                        state: fallbackState,
                        position_seconds: request.position_seconds,
                        rate: request.rate,
                        ...msg,
                    });
                    pending?.resolve(msg);
                }
                return;
            }

            if (msg.type === "bag_playback_status") {
                updateBagPlayback(msg);
                return;
            }

            if (msg.type === "logging_response") {
                const pending = pendingLoggingRequestsRef.current.get(msg.request_id);
                if (!pending) return;

                clearTimeout(pending.timeout);
                pendingLoggingRequestsRef.current.delete(msg.request_id);

                console.log("LOGGING_RESPONSE:", {
                    requestId: msg.request_id,
                    vehicleId: msg.vehicle_id,
                    success: msg.success,
                    isLogging: msg.is_logging,
                    status: msg.logging_status,
                    bagPath: msg.bag_path,
                    message: msg.message,
                    error: msg.error,
                });

                if (msg.success) {
                    pending.resolve(msg);
                } else {
                    pending.reject(
                        new Error(msg.error || msg.message || "Logging request failed")
                    );
                }
                return;
            }

            // 차량 연결 상태(색상 표시용): 릴레이가 1초마다 보냄
            if (msg.type === "vehicle_status") {
                const now = Date.now();
                const next = {};
                for (const s of msg.statuses || []) {
                    if (!s || !s.id) continue;
                    next[s.id] = { msAgo: s.msAgo, receivedAt: now };
                }
                setVehicleStatuses(next);
                return;
            }

            if (msg.type === "vehicle_list") {
                setVehicleList(msg.vehicles);
                setVehiclesData((prev) => {
                    const next = { ...prev };

                    for (const vehicle of msg.vehicles || []) {
                        if (!vehicle?.id) continue;

                        next[vehicle.id] = {
                            ...(prev[vehicle.id] || {}),
                            id: vehicle.id,
                            name: vehicle.name || vehicle.id,
                            isBag: !!vehicle.is_bag,
                        };
                    }

                    return next;
                });
            }

            if (msg.type === "topic_list") {
                const vid = msg.vehicle_id;

                setVehiclesData((prev) => ({
                    ...prev,
                    [vid]: {
                        ...(prev[vid] || {}),
                        topics: msg.topics
                    }
                }));

                const gpsTopic = msg.topics?.find(
                    (topicInfo) => topicInfo?.name === "/ublox_gps_node/fix"
                );
                const hunterStatusTopic = msg.topics?.find(
                    (topicInfo) =>
                        topicInfo?.name === "/hunter_status" ||
                        topicInfo?.name === "vehicle_status_sampled"
                );

                // GPS/hunter는 real·bag 모두에서 자동구독(현재 활성 소스의 데이터를 자동 표시).
                // bag 모드에선 real이 이미 중단돼 있어 bag의 GPS/hunter가 잡힌다.
                if (gpsTopic) {
                    subscribeTopic(vid, gpsTopic.name, gpsTopic.type, {
                        persistent: true,
                    });
                }

                if (hunterStatusTopic) {
                    subscribeTopic(
                        vid,
                        hunterStatusTopic.name,
                        hunterStatusTopic.type,
                        { persistent: true }
                    );
                }
            }

            if (msg.type === "sensor_data") {
                if (typeof msg.sent_at === "number") {
                    const receivedAt = Date.now();
                    const latency = receivedAt - msg.relay_sent_at;
                    const topicKey = `${msg.vehicle_id}::${msg.topic}`;

                    if (!latencyStatsRef.current[topicKey]) {
                        latencyStatsRef.current[topicKey] = {
                            startedAt: receivedAt,
                            samples: [],
                            done: false,
                        };
                    }

                    const stats = latencyStatsRef.current[topicKey];
                    const elapsed = receivedAt - stats.startedAt;

                    if (
                        elapsed >= LATENCY_WARMUP_MS &&
                        elapsed < LATENCY_WARMUP_MS + LATENCY_MEASURE_MS
                    ) {
                        stats.samples.push(latency);
                    }

                    if (
                        !stats.done &&
                        elapsed >= LATENCY_WARMUP_MS + LATENCY_MEASURE_MS
                    ) {
                        stats.done = true;
                    }
                }

                const vid = msg.vehicle_id;
                const topic = msg.topic;

                setVehiclesData((prev) => {
                    const vehicle = prev[vid] || {};

                    if (topic === "/ublox_gps_node/fix") {
                        const { lat, lon } = msg.data;
                        const prevWp = vehicle.waypoints || [];

                        return {
                            ...prev,
                            [vid]: {
                                ...vehicle,
                                lat,
                                lng: lon,
                                waypoints: [...prevWp, { lat, lng: lon }],
                                topicsData: {
                                    ...(vehicle.topicsData || {}),
                                    [topic]: msg.data
                                },
                                rawTopicsData: {
                                    ...(vehicle.rawTopicsData || {}),
                                    [topic]: msg
                                }
                            },
                        };
                    }

                    return {
                        ...prev,
                        [vid]: {
                            ...vehicle,
                            topicsData: {
                                ...(vehicle.topicsData || {}),
                                [topic]: msg.data
                            },
                            rawTopicsData: {
                                ...(vehicle.rawTopicsData || {}),
                                [topic]: msg
                            }
                        }
                    };
                });
            }
        };

        ws.onerror = (e) => {
            console.error("WS error:", e);
        };

        ws.onclose = () => {
            console.warn("WS closed");
            for (const pending of pendingLoggingRequestsRef.current.values()) {
                clearTimeout(pending.timeout);
                pending.reject(new Error("Relay server connection closed"));
            }
            pendingLoggingRequestsRef.current.clear();
            for (const pending of pendingBagRequestsRef.current.values()) {
                clearTimeout(pending.timeout);
                pending.reject(new Error("Relay server connection closed"));
            }
            pendingBagRequestsRef.current.clear();
        };
    }, []);

    const sendBagRequest = (type, payload, timeoutMessage) => {
        return new Promise((resolve, reject) => {
            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                reject(new Error("Relay server connection is not ready"));
                return;
            }

            const requestId = makeRequestId(type);
            const timeout = setTimeout(() => {
                pendingBagRequestsRef.current.delete(requestId);
                reject(new Error(timeoutMessage));
            }, 15000);

            pendingBagRequestsRef.current.set(requestId, {
                resolve,
                reject,
                timeout,
                vehicleId: payload.vehicle_id,
                payload,
            });

            try {
                ws.send(JSON.stringify({
                    type,
                    request_id: requestId,
                    ...payload,
                }));
            } catch (error) {
                clearTimeout(timeout);
                pendingBagRequestsRef.current.delete(requestId);
                reject(error);
            }
        });
    };

    const requestBagList = (vehicleId) => {
        if (!vehicleId) return Promise.reject(new Error("vehicleId is required"));
        return sendBagRequest(
            "bag_list_request",
            { vehicle_id: vehicleId },
            "Bag list request timed out after 15 seconds"
        );
    };

    const requestBagPlayback = ({ vehicleId, action, bagPath, position, rate }) => {
        if (!vehicleId) return Promise.reject(new Error("vehicleId is required"));
        if (!action) return Promise.reject(new Error("playback action is required"));

        const payload = {
            vehicle_id: vehicleId,
            action,
        };
        if (bagPath != null) payload.bag_path = bagPath;
        if (position != null) payload.position_seconds = position;
        if (rate != null) payload.rate = rate;

        return sendBagRequest(
            "bag_playback_request",
            payload,
            "Bag playback request timed out after 15 seconds"
        );
    };

    const requestLogging = ({ vehicleId, isLogging, bagName = "", topics = [] }) => {
        return new Promise((resolve, reject) => {
            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                reject(new Error("Relay server connection is not ready"));
                return;
            }
            if (!vehicleId) {
                reject(new Error("vehicleId is required"));
                return;
            }

            const requestId =
                `logging_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const timeout = setTimeout(() => {
                pendingLoggingRequestsRef.current.delete(requestId);
                reject(new Error("Logging request timed out after 35 seconds"));
            }, 35000);

            pendingLoggingRequestsRef.current.set(requestId, { resolve, reject, timeout });

            try {
                console.log("LOGGING_REQUEST:", {
                    requestId,
                    vehicleId,
                    command: isLogging ? "LoggingStart" : "LoggingStop",
                    topicCount: isLogging ? topics.length : 0,
                    bagName: isLogging ? bagName : "",
                });
                ws.send(JSON.stringify({
                    type: "logging_request",
                    request_id: requestId,
                    vehicle_id: vehicleId,
                    is_logging: isLogging ? "LoggingStart" : "LoggingStop",
                    topics: isLogging ? topics : [],
                    bag_name: isLogging ? bagName : "",
                }));
            } catch (error) {
                clearTimeout(timeout);
                pendingLoggingRequestsRef.current.delete(requestId);
                reject(error);
            }
        });
    };

    const requestTopicList = (vehicleId) => {
        if (!wsRef.current || wsRef.current.readyState !== 1) {
            console.warn("ws not ready");
            return;
        }

        wsRef.current.send(JSON.stringify({
            type: "get_topic_list",
            vehicle_id: vehicleId
        }));

        console.log("GET_TOPIC_LIST:", vehicleId);
    };

    const subscribeTopic = (
        vehicleId,
        topic,
        topicType,
        { persistent = false } = {}
    ) => {
        if (!wsRef.current || wsRef.current.readyState !== 1) {
            console.warn("ws not ready");
            return;
        }

        const topicKey = makeTopicKey(vehicleId, topic);
        subscribedTypesRef.current.set(topicKey, topicType); // 재구독 시 msg_type 필요

        if (persistent || PERSISTENT_TOPICS.has(topic)) {
            persistentSubscribedRef.current.add(topicKey);
        }

        if (subscribedRef.current.has(topicKey)) {
            console.log("Already subscribed:", topicKey);
            return;
        }

        subscribedRef.current.add(topicKey);
        wsRef.current.send(JSON.stringify({
            type: "subscribe",
            vehicle_id: vehicleId,
            topic,
            msg_type: topicType
        }));

        console.log("SUBSCRIBE:", topicKey, topicType);
    };

    const unsubscribeTopic = (vehicleId, topic, { force = false } = {}) => {
        if (!wsRef.current || wsRef.current.readyState !== 1) {
            console.warn("ws not ready");
            return;
        }

        const topicKey = makeTopicKey(vehicleId, topic);

        if (
            !force &&
            (PERSISTENT_TOPICS.has(topic) || persistentSubscribedRef.current.has(topicKey))
        ) {
            console.log("KEEP SUBSCRIBED (persistent):", topicKey);
            return;
        }

        if (!subscribedRef.current.has(topicKey)) {
            console.warn("Not subscribed:", topicKey);
            return;
        }

        subscribedRef.current.delete(topicKey);
        persistentSubscribedRef.current.delete(topicKey);

        wsRef.current.send(JSON.stringify({
            type: "unsubscribe",
            vehicle_id: vehicleId,
            topic,
            force,
        }));

        console.log("UNSUBSCRIBE:", topicKey, force ? "(force)" : "");
    };

    const getAverageLatency = (vehicleId, topic) => {
        const topicKey = `${vehicleId}::${topic}`;
        return latencyResultsRef.current[topicKey]?.average ?? null;
    };

    // 대시보드에서 이 차량 보기를 종료: 구독 해제 + topic_list 갱신 중단 + 사이드바에서 제거
    const disconnectVehicle = (vehicleId) => {
        if (!vehicleId) return;

        // 이 차량의 모든 토픽 구독 해제(상시 구독도 차량 연결 종료에서는 정리)
        for (const key of Array.from(subscribedRef.current)) {
            if (key.startsWith(`${vehicleId}::`)) {
                const topic = key.slice(vehicleId.length + 2); // "::" = 2글자
                unsubscribeTopic(vehicleId, topic, { force: true });
            }
        }

        // 릴레이에 topic_list 갱신 중단 요청(다시 나타나지 않게)
        if (wsRef.current?.readyState === 1) {
            wsRef.current.send(
                JSON.stringify({ type: "stop_topic_list", vehicle_id: vehicleId })
            );
        }

        // 사이드바에서 사라지도록 topics 관련 상태 제거(기본 정보는 유지 → 재연결 가능)
        setVehiclesData((prev) => {
            const v = prev[vehicleId];
            if (!v) return prev;
            const rest = { ...v };
            delete rest.topics;
            delete rest.topicsData;
            delete rest.rawTopicsData;
            return { ...prev, [vehicleId]: rest };
        });
    };

    // 차량 이동 경로(waypoints) 초기화. vehicleId 미지정 시 전체 차량.
    // 현재 구독 스냅샷(재구독에 필요한 type/persistent 포함)
    const captureCurrentSubscriptions = () => {
        const snap = [];
        for (const key of Array.from(subscribedRef.current)) {
            const idx = key.indexOf("::");
            const vehicleId = idx >= 0 ? key.slice(0, idx) : key;
            const topic = idx >= 0 ? key.slice(idx + 2) : "";
            if (!topic) continue;
            snap.push({
                vehicleId,
                topic,
                type: subscribedTypesRef.current.get(key) || "",
                persistent: persistentSubscribedRef.current.has(key),
            });
        }
        return snap;
    };

    const clearAllSubscriptions = () => {
        for (const key of Array.from(subscribedRef.current)) {
            const idx = key.indexOf("::");
            const vehicleId = idx >= 0 ? key.slice(0, idx) : key;
            const topic = idx >= 0 ? key.slice(idx + 2) : "";
            if (!topic) continue;
            unsubscribeTopic(vehicleId, topic, { force: true });
        }
    };

    const restoreSubscriptions = (snapshot) => {
        for (const s of (snapshot || [])) {
            subscribeTopic(s.vehicleId, s.topic, s.type, { persistent: s.persistent });
        }
    };

    // real ↔ bag 데이터 모드 전환:
    //  - 현재 모드의 구독을 스냅샷에 저장하고 전부 해제(라이브/재생 전송 중단)
    //  - 대상 모드의 스냅샷을 복원(다시 연결) → 한 번에 한 소스만 흘러 토픽 충돌 방지
    const switchDataMode = (toMode) => {
        const from = currentDataModeRef.current;
        if (from === toMode) return;

        modeSubsRef.current[from] = captureCurrentSubscriptions();
        clearAllSubscriptions();

        currentDataModeRef.current = toMode;
        restoreSubscriptions(modeSubsRef.current[toMode] || []);
        console.log(`switchDataMode: ${from} -> ${toMode}`);
    };

    const resetPath = (vehicleId) => {
        setVehiclesData((prev) => {
            const next = {};
            for (const [id, data] of Object.entries(prev)) {
                next[id] =
                    !vehicleId || id === vehicleId
                        ? { ...data, waypoints: [] }
                        : data;
            }
            return next;
        });
    };

    // 경로(waypoints) + 현재 마커 위치(lat/lng)까지 완전 초기화.
    // (bag 변경/정지 시 이전 이동 흔적을 지워야 할 때 사용)
    const clearVehicleTrack = (vehicleId) => {
        setVehiclesData((prev) => {
            const next = {};
            for (const [id, data] of Object.entries(prev)) {
                if (!vehicleId || id === vehicleId) {
                    const { lat, lng, ...rest } = data;
                    next[id] = { ...rest, waypoints: [] };
                } else {
                    next[id] = data;
                }
            }
            return next;
        });
    };


    return {
        vehiclesData,
        vehicleList,
        vehicleStatuses,
        bagFilesByVehicle,
        bagPlayback,
        requestLogging,
        requestBagList,
        requestBagPlayback,
        requestTopicList,
        subscribeTopic,
        unsubscribeTopic,
        switchDataMode,
        getAverageLatency,
        resetPath,
        clearVehicleTrack,
        disconnectVehicle
    };
}
