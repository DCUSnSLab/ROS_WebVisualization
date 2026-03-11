import { useEffect, useState, useRef } from "react";
import * as ROSLIB from "roslib";
import { useDispatch } from "react-redux";
import { updateTopicsForVehicle } from "../../../features/PublishedTopics/PublishedTopicSlice";

export default function UseRosVehicles(vehicles) {
    const [vehiclesData, setVehiclesData] = useState({});
    const dispatch = useDispatch();

    const rosConnections = useRef({});

    useEffect(() => {
        if (!vehicles || vehicles.length === 0) return;

        vehicles.forEach(({ ip, name }) => {
            if (!ip) return;
            if (rosConnections.current[ip]) return;

            const ros = new ROSLIB.Ros({ url: ip });

            rosConnections.current[ip] = {
                ros,
                gpsTopic: null,
                knownTopics: [],
                interval: null,
            };

            ros.on("connection", () => {
                console.log(`✅ Connected: ${ip}`);

                const refreshTopics = () => {
                    ros.getTopics((topics) => {
                        const names = topics?.topics || [];
                        const types = topics?.types || [];
                        const conn = rosConnections.current[ip];

                        const prevTopics = conn.knownTopics || [];

                        // 새 토픽
                        const added = names.filter((t) => !prevTopics.includes(t));

                        // 사라진 토픽
                        const removed = prevTopics.filter((t) => !names.includes(t));

                        if (added.length > 0) {
                            console.log("📌 Added topics:", added);
                        }

                        if (removed.length > 0) {
                            console.log("❌ Removed topics:", removed);
                        }

                        conn.knownTopics = names;

                        // Redux 업데이트
                        dispatch(
                            updateTopicsForVehicle({
                                vehicleId: ip,
                                topics: { topic: names, type: types },
                            })
                        );

                        // React state 업데이트
                        setVehiclesData((prev) => ({
                            ...prev,
                            [ip]: {
                                ...(prev[ip] || { waypoints: [] }),
                                name,
                                topics: names,
                            },
                        }));

                        // GPS topic 확인
                        // const gpsTopicName = names.includes("/gps_sampled")
                        //     ? "/gps_sampled"
                        //     : null;

                        //기존 gps 연결 방식
                        const gpsTopicName = names.includes("/ublox_gps_node/fix")
                            ? "/ublox_gps_node/fix"
                            : names.includes("/ublox_gps/fix")
                                ? "/ublox_gps/fix"
                                : names.includes("/ublox/fix")
                                    ? "/ublox/fix"
                                    : null;

                        if (gpsTopicName && !conn.gpsTopic) {
                            const gpsTopic = new ROSLIB.Topic({
                                ros,
                                name: gpsTopicName,
                                messageType: "sensor_msgs/NavSatFix",
                            });

                            conn.gpsTopic = gpsTopic;

                            gpsTopic.subscribe((msg) => {
                                const { latitude, longitude } = msg || {};

                                if (
                                    typeof latitude !== "number" ||
                                    typeof longitude !== "number"
                                )
                                    return;

                                setVehiclesData((prev) => {
                                    const prevWaypoints =
                                        prev[ip]?.waypoints || [];

                                    const nextWp = [
                                        ...prevWaypoints,
                                        { lat: latitude, lng: longitude },
                                    ];

                                    return {
                                        ...prev,
                                        [ip]: {
                                            ...(prev[ip] || {}),
                                            name,
                                            lat: latitude,
                                            lng: longitude,
                                            waypoints: nextWp,
                                        },
                                    };
                                });
                            });

                            console.log("📡 GPS subscribed:", gpsTopicName);
                        }
                    });
                };

                // 최초 실행
                refreshTopics();

                // 30초마다 토픽 갱신
                rosConnections.current[ip].interval = setInterval(
                    refreshTopics,
                    30000
                );
            });

            ros.on("error", (e) => {
                console.error("ROS error", ip, e);
            });

            ros.on("close", () => {
                console.warn("ROS closed", ip);
            });
        });

        return () => {
            Object.entries(rosConnections.current).forEach(
                ([ip, { ros, gpsTopic, interval }]) => {
                    try {
                        gpsTopic?.unsubscribe();
                    } catch {}

                    try {
                        ros?.close();
                    } catch {}

                    try {
                        clearInterval(interval);
                    } catch {}
                }
            );

            rosConnections.current = {};
        };
    }, [vehicles, dispatch]);

    return vehiclesData;
}