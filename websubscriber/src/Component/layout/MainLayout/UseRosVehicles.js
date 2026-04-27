import { useEffect, useState, useRef } from "react";

export default function UseRosVehicles() {
    const [vehiclesData, setVehiclesData] = useState({});
    const [vehicleList, setVehicleList] = useState([]);
    const wsRef = useRef(null);
    const subscribedRef = useRef(new Set());
    const latencyStatsRef = useRef({});
    const latencyResultsRef = useRef({});

    const LATENCY_WARMUP_MS = 10_000;
    const LATENCY_MEASURE_MS = 60_000;

    const makeTopicKey = (vehicleId, topic) => `${vehicleId}::${topic}`;

    useEffect(() => {
        if (wsRef.current) return;

        const ws = new WebSocket("ws://203.250.34.164:8080");
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

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

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
                            rosbridgeIp: vehicle.rosbridge_ip || vehicle.rosbridgeIp || "",
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

                        if (stats.samples.length > 0) {
                            const avgLatency =
                                stats.samples.reduce((acc, cur) => acc + cur, 0) /
                                stats.samples.length;

                            latencyResultsRef.current[topicKey] = {
                                average: avgLatency,
                                count: stats.samples.length,
                                warmupMs: LATENCY_WARMUP_MS,
                                measureMs: LATENCY_MEASURE_MS,
                            };

                            console.log(
                                `[LATENCY RESULT] ${topicKey} avg=${avgLatency.toFixed(2)}ms samples=${stats.samples.length}`
                            );
                        } else {
                            latencyResultsRef.current[topicKey] = {
                                average: null,
                                count: 0,
                                warmupMs: LATENCY_WARMUP_MS,
                                measureMs: LATENCY_MEASURE_MS,
                            };

                            console.warn(
                                `[LATENCY RESULT] ${topicKey} no samples collected in measurement window`
                            );
                        }
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
        };
    }, []);

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

    const unsubscribeTopic = (vehicleId, topic) => {
        if (!wsRef.current || wsRef.current.readyState !== 1) {
            console.warn("ws not ready");
            return;
        }

        const topicKey = makeTopicKey(vehicleId, topic);

        if (!subscribedRef.current.has(topicKey)) {
            console.warn("Not subscribed:", topicKey);
            return;
        }

        subscribedRef.current.delete(topicKey);

        wsRef.current.send(JSON.stringify({
            type: "unsubscribe",
            vehicle_id: vehicleId,
            topic
        }));

        console.log("UNSUBSCRIBE:", topicKey);
    };

    const getAverageLatency = (vehicleId, topic) => {
        const topicKey = `${vehicleId}::${topic}`;
        return latencyResultsRef.current[topicKey]?.average ?? null;
    };


    return {
        vehiclesData,
        vehicleList,
        requestTopicList,
        subscribeTopic,
        unsubscribeTopic,
        getAverageLatency
    };
}
