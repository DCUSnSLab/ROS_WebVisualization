import { useEffect, useState, useRef } from "react";

export default function UseRosVehicles() {
    const [vehiclesData, setVehiclesData] = useState({});
    const [vehicleList, setVehicleList] = useState([]);
    const wsRef = useRef(null);
    const subscribedRef = useRef(new Set());

    useEffect(() => {
        if (wsRef.current) return;

        const ws = new WebSocket("ws://203.250.34.164:8080");
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("✅ WS Connected");

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
            }

            // server가 topic_list를 보내줬을 때 실행. 즉, 응답 처리 (server -> user)
            if (msg.type === "topic_list") {
                const vid = msg.vehicle_id;

                setVehiclesData((prev) => ({
                    ...prev,
                    [vid]: {
                        ...(prev[vid] || {}),
                        topics: msg.topics
                    }
                }));
            }

            // 토픽 구독 응답
            if (msg.type === "sensor_data") {
                const vid = msg.vehicle_id;
                const topic = msg.topic;

                setVehiclesData((prev) => {
                    const vehicle = prev[vid] || {};

                    // gps 처리
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
                            },
                        };
                    }

                    // gps를 제외한 나머지 토픽 처리
                    return {
                        ...prev,
                        [vid]: {
                            ...vehicle,
                            topicsData: {
                                ...(vehicle.topicsData || {}),
                                [topic]: msg.data
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

    const connectVehicle = (vehicleId, topic, topicType) => {
        if (!wsRef.current || wsRef.current.readyState !== 1) {
            console.warn("ws not ready");
            return;
        }
        if (subscribedRef.current.has(topic)) {
            console.warn("이미 구독중:", topic);
            return;
        }

        subscribedRef.current.add(topic);

        wsRef.current.send(JSON.stringify({
            type: "subscribe",
            vehicle_id: vehicleId,
            topic: topic,
            msg_type: topicType
        }));

        console.log("🚗 SUBSCRIBE:", vehicleId, topic, topicType);

        wsRef.current.send(JSON.stringify({
            type: "get_topic_list",
            vehicle_id: vehicleId
        }));

        console.log("🚗 CONNECT:", vehicleId);
    };

    return { vehiclesData, vehicleList, connectVehicle };
}