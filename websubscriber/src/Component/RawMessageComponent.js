// Import the necessary modules and components
import React, {useEffect, useRef, useState} from "react";
import { useSelector } from "react-redux";
import * as ROSLIB from "roslib";
import {useROS} from "../ROSContext";

export default function RawMessageComponent({ topic, ip }) {

    const [msg, setMsg] = useState(null);
    const latestMsgRef = useRef(null);


    useEffect(() => {
        if (!ip || !topic) {
            return;
        }

        const ros = new ROSLIB.Ros({
            url: ip
        });

        let listener;

        // Fetch the topic type, then create the subscriber
        ros.getTopicType(topic, (messageType) => {
            if (messageType) {
                listener = new ROSLIB.Topic({
                    ros: ros,
                    name: topic,
                    messageType: messageType,
                });

                listener.subscribe((message) => {
                    // Store the latest message in a ref to avoid re-rendering on every message
                    latestMsgRef.current = message;
                });
            } else {
                console.error(`Could not determine message type for topic: ${topic}`);
            }
        });

        // Update the displayed message every 2 seconds
        const intervalId = setInterval(() => {
            if (latestMsgRef.current) {
                setMsg(latestMsgRef.current);
            }
        }, 200);

        return () => {
            if (listener) {
                listener.unsubscribe();
            }
            clearInterval(intervalId);
            ros.close();
        };
    }, [topic, ip]);

    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            {msg ? (
                <pre>{JSON.stringify(msg, null, 2)}</pre>
            ) : (
                <p>Waiting for messages...</p>
            )}
        </div>
    );
}
