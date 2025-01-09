// Import the necessary modules and components
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ROSLIB from "roslib";
import {useROS} from "../ROSContext";

export default function RawMessageComponent({ topic }) {

    const receivedTopic = topic;
    const [receivedType, setReceivedType] = useState();
    const topicList = useSelector((state) => state.TopicList.topics.topic);
    const typeList = useSelector((state) => state.TopicList.topics.type);
    const [msg, setMsg] = useState();

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);


    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        setReceivedType(
            topicList.findIndex((value) => value === receivedTopic)
        );

        const listener = new ROSLIB.Topic({
            ros: ros,
            name: receivedTopic,
            messageType: typeList[receivedType],
        });

        listener.subscribe((message) => {
            setMsg(message);
        });

      // Additional ROS topic definition (not sure if it's needed in your use case)
        const exampleTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/com/endpoint/example',
            messageType: 'std_msgs/String',
        });

    }, []);

    return (
        <div style={{ overflow: "scroll", height: "auto" }}>
          {JSON.stringify(msg, null, '\n')}
        </div>
    );
}
