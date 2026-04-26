import React, { useLayoutEffect, useRef } from "react";
import { Grid, PointCloud2, Viewer } from "ros3d";
import * as ROSLIB from "roslib";

export default function PCL({ topic, vehicleId, rosbridgeUrl }) {
    const containerRef = useRef(null);
    const elemIdRef = useRef(
        `pcl-viewer-${topic.replace(/\//g, "-")}-${Math.random()
            .toString(36)
            .slice(2)}`
    );

    useLayoutEffect(() => {
        if (!containerRef.current || !rosbridgeUrl) return undefined;

        const width = containerRef.current.clientWidth || 600;
        const height = containerRef.current.clientHeight || 400;

        const ros = new ROSLIB.Ros({ url: rosbridgeUrl });

        ros.on("connection", () => {
            console.log("[PCL] ROS connected:", rosbridgeUrl);
        });

        ros.on("error", (error) => {
            console.warn("[PCL] ROS error:", error);
        });

        ros.on("close", () => {
            console.log("[PCL] ROS closed");
        });

        const viewer = new Viewer({
            divID: elemIdRef.current,
            width,
            height,
            antialias: false,
            background: "#111111",
        });

        viewer.addObject(new Grid());

        const tfClient = new ROSLIB.TFClient({
            ros,
            angularThres: 0.1,
            transThres: 0.1,
            rate: 1.0,
            fixedFrame: "/velodyne",
        });

        const cloudClient = new PointCloud2({
            ros,
            rootObject: viewer.scene,
            tfClient,
            topic,
            material: { color: 0xff00ff, size: 0.02 },
            max_pts: 10000,
        });

        const handleResize = () => {
            if (!containerRef.current) return;
            viewer.resize(
                containerRef.current.clientWidth || width,
                containerRef.current.clientHeight || height
            );
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            try {
                cloudClient.unsubscribe?.();
            } catch {}

            try {
                tfClient.unsubscribe();
            } catch {}

            try {
                ros.close();
            } catch {}
        };
    }, [rosbridgeUrl, topic]);

    if (!rosbridgeUrl) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    fontSize: "14px",
                    textAlign: "center",
                    padding: "16px",
                }}
            >
                PointCloud is unavailable because no rosbridge URL is registered for{" "}
                {vehicleId}.
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%" }}
        >
            <div
                id={elemIdRef.current}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
