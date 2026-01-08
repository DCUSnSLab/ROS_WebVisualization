import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

export default function UseRosVehicles(vehicles) {
    const [vehiclesData, setVehiclesData] = useState({});

    useEffect(() => {
        if (!vehicles || vehicles.length === 0) {
            setVehiclesData({});
            return;
        }

        const rosConnections = {};
        // ip -> { ros, metaTopic, gpsTopic }

        vehicles.forEach(({ ip, name }) => {
            if (!ip || rosConnections[ip]) return;

            const ros = new ROSLIB.Ros({ url: ip });

            rosConnections[ip] = {
                ros,
                metaTopic: null,
                gpsTopic: null,
            };

            /* ===============================
               ROS CONNECTION
            =============================== */
            ros.on("connection", () => {
                console.log(`✅ Connected: ${ip}`);

                /* ===============================
                   TOPICS + TYPES (MAIN META)
                =============================== */
                const metaTopic = new ROSLIB.Topic({
                    ros,
                    name: "/scms_meta/topics",
                    messageType: "std_msgs/String",
                });

                rosConnections[ip].metaTopic = metaTopic;

                metaTopic.subscribe((msg) => {
                    let parsed;
                    try {
                        parsed = JSON.parse(msg.data);
                    } catch (e) {
                        console.error("Invalid metadata JSON", e);
                        return;
                    }

                    const topicNames = parsed.topics || [];

                    /* ===============================
                       UPDATE TOPIC LIST (UI)
                    =============================== */
                    setVehiclesData((prev) => ({
                        ...prev,
                        [ip]: {
                            ...(prev[ip] || { waypoints: [] }),
                            name,
                            topics: topicNames,
                        },
                    }));

                    /* ===============================
                       GPS AUTO SUBSCRIBE (RETRY OK)
                    =============================== */
                    const pickGps = (names) =>
                        names.includes("/ublox_gps_node/fix")
                            ? "/ublox_gps_node/fix"
                            : names.includes("/ublox_gps/fix")
                                ? "/ublox_gps/fix"
                                : names.includes("/ublox/fix")
                                    ? "/ublox/fix"
                                    : null;

                    const gpsTopicName = pickGps(topicNames);
                    if (!gpsTopicName) return;

                    // 이미 구독 중이면 스킵
                    if (rosConnections[ip].gpsTopic) return;

                    const gpsTopic = new ROSLIB.Topic({
                        ros,
                        name: gpsTopicName,
                        messageType: "sensor_msgs/NavSatFix",
                    });

                    rosConnections[ip].gpsTopic = gpsTopic;

                    gpsTopic.subscribe((msg) => {
                        const { latitude, longitude } = msg || {};
                        if (
                            typeof latitude !== "number" ||
                            typeof longitude !== "number"
                        )
                            return;

                        setVehiclesData((prev) => {
                            const current = prev[ip] || {};
                            const prevWaypoints = current.waypoints || [];
                            const last =
                                prevWaypoints[prevWaypoints.length - 1];

                            // 중복 좌표 제거
                            if (
                                last &&
                                last.lat === latitude &&
                                last.lng === longitude
                            ) {
                                return prev;
                            }

                            return {
                                ...prev,
                                [ip]: {
                                    ...current,
                                    name,
                                    lat: latitude,
                                    lng: longitude,
                                    waypoints: [
                                        ...prevWaypoints,
                                        {
                                            lat: latitude,
                                            lng: longitude,
                                        },
                                    ],
                                },
                            };
                        });
                    });
                });
            });

            ros.on("error", (e) => {
                console.error("❌ ROS error", ip, e);
            });

            ros.on("close", () => {
                console.warn("⚠️ ROS closed", ip);
            });
        });

        /* ===============================
           CLEANUP
        =============================== */
        return () => {
            Object.values(rosConnections).forEach(
                ({ ros, metaTopic, gpsTopic }) => {
                    try {
                        gpsTopic && gpsTopic.unsubscribe();
                        metaTopic && metaTopic.unsubscribe();
                    } catch (e) {
                        console.error("Unsubscribe error", e);
                    }

                    try {
                        ros && ros.isConnected && ros.close();
                    } catch (e) {
                        console.error("ROS close error", e);
                    }
                }
            );
        };
    }, [vehicles]);

    return vehiclesData;
}
