import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

export default function UseRosVehicles(vehicles) {
    const [vehiclesData, setVehiclesData] = useState({});


    useEffect(() => {
        if (!vehicles || vehicles.length === 0) return;

        const rosConnections = {};

        vehicles.forEach(({ ip, name }) => {
            if (!ip) return;
            if (rosConnections[ip]) return;

            const ros = new ROSLIB.Ros({ url: ip });
            rosConnections[ip] = { ros, gpsTopic: null };

            ros.on("connection", () => {
                console.log(`Connected to ${ip}`);

                ros.getTopics((topics) => {
                    const topicNames = topics?.topics || [];
                    const gpsTopicName =
                        topicNames.includes("/ublox_gps_node/fix")
                            ? "/ublox_gps_node/fix"
                            : topicNames.includes("/ublox_gps/fix")
                                ? "/ublox_gps/fix"
                                : topicNames.includes("/ublox/fix")
                                    ? "/ublox/fix"
                                    : null;

                    if (!gpsTopicName) {
                        console.warn(`⚠ No GPS topic found for ${ip}`);
                        return;
                    }

                    const gpsTopic = new ROSLIB.Topic({
                        ros,
                        name: gpsTopicName,
                        messageType: "sensor_msgs/NavSatFix",
                    });
                    rosConnections[ip].gpsTopic = gpsTopic;

                    gpsTopic.subscribe((msg) => {
                        const { latitude, longitude } = msg;
                        if (!latitude || !longitude) return;

                        setVehiclesData((prev) => ({
                            ...prev,
                            [ip]: {
                                name,
                                lat: latitude,
                                lng: longitude,
                                waypoints: [
                                    ...(prev[ip]?.waypoints || []),
                                    { lat: latitude, lng: longitude },
                                ],
                            },
                        }));
                    });
                });
            });

            ros.on("error", (err) => console.error(`ROS Error (${ip})`, err));
            ros.on("close", () => console.warn(`Connection closed (${ip})`));
        });

        return () => {
            Object.entries(rosConnections).forEach(([ip, { ros, gpsTopic }]) => {
                gpsTopic?.unsubscribe();
                ros?.close();
                setVehiclesData((prev) => {
                    const updated = {...prev};
                    delete updated[ip];
                    return updated;
                });
            });
        };
    }, [vehicles]);

    return vehiclesData || {};
}
