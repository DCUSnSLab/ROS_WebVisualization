// Import the necessary modules and components
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ROSLIB from "roslib";

// Define the ROS instance (assuming it's declared somewhere in your code)
const ros = new ROSLIB.Ros({
  url: 'ws://203.250.33.143:9090'
});

// Define the RawMessageComponent
export default function RawMessageComponent({ topic }) {
      const receivedTopic = topic;
      const [receivedType, setReceivedType] = useState();
      const topicList = useSelector((state) => state.TopicList.topics.topic);
      const typeList = useSelector((state) => state.TopicList.topics.type);
      const [msg, setMsg] = useState();

      useEffect(() => {
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

    }, [receivedTopic, receivedType, topicList, typeList]);

    return (
        <div style={{ overflow: "scroll", height: "auto" }}>
          {JSON.stringify(msg, null, '\n')}
        </div>
    );
}
