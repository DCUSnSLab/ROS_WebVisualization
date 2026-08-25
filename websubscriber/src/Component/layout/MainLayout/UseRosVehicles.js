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
    const wsRef = useRef(null);
    const subscribedRef = useRef(new Set());
    const latencyStatsRef = useRef({});
    const latencyResultsRef = useRef({});
    const pendingLoggingRequestsRef = useRef(new Map());

    // 실험 시간
    const LATENCY_WARMUP_MS = 10_000;
    const LATENCY_MEASURE_MS = 60_000;

    const makeTopicKey = (vehicleId, topic) => `${vehicleId}::${topic}`;

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

                if (gpsTopic) {
                    subscribeTopic(vid, gpsTopic.name, gpsTopic.type);
                }

                if (hunterStatusTopic) {
                    subscribeTopic(
                        vid,
                        hunterStatusTopic.name,
                        hunterStatusTopic.type
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
        };
    }, []);

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

    const subscribeTopic = (vehicleId, topic, topicType) => {
        if (!wsRef.current || wsRef.current.readyState !== 1) {
            console.warn("ws not ready");
            return;
        }

        const topicKey = makeTopicKey(vehicleId, topic);

        if (subscribedRef.current.has(topicKey)) {
            console.warn("Already subscribed:", topicKey);
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

        if (PERSISTENT_TOPICS.has(topic) && !force) {
            console.log("KEEP SUBSCRIBED (persistent):", topicKey);
            return;
        }

        if (!subscribedRef.current.has(topicKey)) {
            console.warn("Not subscribed:", topicKey);
            return;
        }

        subscribedRef.current.delete(topicKey);

        wsRef.current.send(JSON.stringify({
            type: "unsubscribe",
            vehicle_id: vehicleId,
            topic,
            force,
        }));

        console.log("UNSUBSCRIBE:", topicKey);
    };

    const getAverageLatency = (vehicleId, topic) => {
        const topicKey = `${vehicleId}::${topic}`;
        return latencyResultsRef.current[topicKey]?.average ?? null;
    };

    // 대시보드에서 이 차량 보기를 종료: 구독 해제 + topic_list 갱신 중단 + 사이드바에서 제거
    const disconnectVehicle = (vehicleId) => {
        if (!vehicleId) return;

        // 이 차량의 모든 토픽 구독 해제
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


    return {
        vehiclesData,
        vehicleList,
        vehicleStatuses,
        requestLogging,
        requestTopicList,
        subscribeTopic,
        unsubscribeTopic,
        getAverageLatency,
        resetPath,
        disconnectVehicle
    };
}
