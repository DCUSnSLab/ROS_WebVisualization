// UseRosVehicles.js (JS 버전)
import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

export default function UseRosVehicles(vehicles) {
    const [vehiclesData, setVehiclesData] = useState({});

    useEffect(() => {
        if (!vehicles || vehicles.length === 0) return;

        const rosConnections = {}; // ip -> { ros, gpsTopic? }

        vehicles.forEach(({ ip, name }) => {
            if (!ip) return;
            if (rosConnections[ip]) return;

            const ros = new ROSLIB.Ros({ url: ip });
            rosConnections[ip] = { ros, gpsTopic: null };

            ros.on("connection", () => {
                console.log(`✅ Connected: ${ip}`);

                // ① 현재 토픽 목록 저장
                ros.getTopics((topics) => {
                    const allTopics = (topics?.topics || []);
                    const uniqueSorted = Array.from(new Set(allTopics)).sort();

                    setVehiclesData((prev) => ({
                        ...prev,
                        [ip]: {
                            ...(prev[ip] || { waypoints: [] }),
                            name,
                            topics: uniqueSorted,
                        },
                    }));
                });

                // ② GPS (예: /ublox_gps_node/fix, /ublox_gps/fix, /ublox/fix)
                const pickGps = (names) =>
                    names.includes("/ublox_gps_node/fix")
                        ? "/ublox_gps_node/fix"
                        : names.includes("/ublox_gps/fix")
                            ? "/ublox_gps/fix"
                            : names.includes("/ublox/fix")
                                ? "/ublox/fix"
                                : null;

                ros.getTopics((t) => {
                    const names = t?.topics || [];
                    const gpsTopicName = pickGps(names);
                    if (!gpsTopicName) return;

                    const gpsTopic = new ROSLIB.Topic({
                        ros,
                        name: gpsTopicName,
                        messageType: "sensor_msgs/NavSatFix",
                    });
                    rosConnections[ip].gpsTopic = gpsTopic;

                    gpsTopic.subscribe((msg) => {
                        const { latitude, longitude } = msg || {};
                        if (typeof latitude !== "number" || typeof longitude !== "number") return;

                        setVehiclesData((prev) => {
                            const prevWaypoints = prev[ip]?.waypoints || [];
                            const nextWp = [...prevWaypoints, { lat: latitude, lng: longitude }];
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
                });
            });

            ros.on("error", (e) => console.error("ROS error", ip, e));
            ros.on("close", () => console.warn("ROS closed", ip));
        });

        return () => {
            Object.entries(rosConnections).forEach(([ip, { ros, gpsTopic }]) => {
                try { gpsTopic?.unsubscribe(); } catch {}
                try { ros?.close(); } catch {}
            });
        };
    }, [vehicles]);

    return vehiclesData; // { [ip]: { name, topics: [...], lat, lng, waypoints: [...] } }
}
