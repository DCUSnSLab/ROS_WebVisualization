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

            console.log("📡 sensor:", msg.topic);

            // test (수정 필요)
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

            if (msg.type === "sensor_data") {
                const { lat, lon } = msg.data;
                const vid = msg.vehicle_id;

                setVehiclesData((prev) => {
                    const prevWp = prev[vid]?.waypoints || [];

                    return {
                        ...prev,
                        [vid]: {
                            ...(prev[vid] || {}),
                            lat,
                            lng: lon,
                            waypoints: [...prevWp, { lat, lng: lon }],
                        },
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
        if (subscribedRef.current.has(topic)) {
            console.warn("이미 구독중:", topic);
            return;
        }

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