import React, { useLayoutEffect, useRef } from "react";
import { Viewer, Grid, PointCloud2 } from "ros3d";
import * as ROSLIB from "roslib";

export default function PCL({ topic, ip }) {
    const viewerRef = useRef(null);
    const rosRef = useRef(null);
    const cloudClientRef = useRef(null);
    const unmountedRef = useRef(false);

    const elemIdRef = useRef(
        `pcl-viewer-${topic.replace(/\//g, "-")}-${Math.random()
            .toString(36)
            .slice(2)}`
    );

    useLayoutEffect(() => {
        if (!viewerRef.current) return;

        unmountedRef.current = false;

        const { clientWidth, clientHeight } = viewerRef.current;

        const ros = new ROSLIB.Ros({ url: ip });
        rosRef.current = ros;

        ros.on("connection", () => {
            console.log("[PCL] ROS connected:", ip);
        });

        ros.on("error", (error) => {
            console.warn("[PCL] ROS error:", error);
        });

        ros.on("close", () => {
            console.log("[PCL] ROS closed");
        });

        const viewer = new Viewer({
            divID: elemIdRef.current,
            width: clientWidth,
            height: clientHeight,
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

        let tfAvailable = false;

        const tfChecker = new ROSLIB.Topic({
            ros,
            name: "/tf",
            messageType: "tf2_msgs/TFMessage",
        });

        tfChecker.subscribe((msg) => {
            if (
                msg?.transforms?.some(
                    (t) =>
                        t?.header?.frame_id?.includes("velodyne") ||
                        t?.child_frame_id?.includes("velodyne")
                )
            ) {
                tfAvailable = true;
                tfChecker.unsubscribe();
            }
        });

        const fakeTFClient = {
            subscribe: (_, cb) => {
                cb({
                    translation: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0, w: 1 },
                });
            },
            unsubscribe: () => {},
        };

        const timeoutId = setTimeout(() => {
            if (unmountedRef.current) return;

            cloudClientRef.current = new PointCloud2({
                ros,
                rootObject: viewer.scene,
                tfClient: tfAvailable ? tfClient : fakeTFClient,
                topic,
                material: { color: 0xff00ff, size: 0.02 },
                max_pts: 10000,
            });

            if (!tfAvailable) {
                tfChecker.unsubscribe();
            }
        }, 2000);

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                viewer.resize(width, height);
            }
        });

        resizeObserver.observe(viewerRef.current);

        return () => {
            unmountedRef.current = true;
            clearTimeout(timeoutId);

            try {
                resizeObserver.disconnect();
            } catch {}

            try {
                tfChecker?.unsubscribe();
            } catch {}

            try {
                cloudClientRef.current?.unsubscribe?.();
            } catch {}
            cloudClientRef.current = null;

            try {
                tfClient?.unsubscribe();
            } catch {}

            try {
                ros?.close();
            } catch {}
            rosRef.current = null;
        };
    }, [ip, topic]);

    return (
        <div
            id={elemIdRef.current}
            ref={viewerRef}
            style={{ width: "100%", height: "100%" }}
        />
    );
}
