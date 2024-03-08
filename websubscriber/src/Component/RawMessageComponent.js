import {useSelector} from "react-redux";
import * as ROSLIB from "roslib";
import {useEffect, useRef, useState} from "react";


    const ros = new ROSLIB.Ros({
        url : 'ws://203.250.33.143:9090'
    });
export default function RawMessageComponent({topic, commonProps}){

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    let w, h = {commonProps};
    console.log(w, h)
    const receivedTopic = topic;
    const [receivedType, setReceivedType] = useState();
    const topicList = useSelector((state) => state.TopicList.topics.topic);
    const typeList = useSelector((state) => state.TopicList.topics.type);
    const [msg, setMsg] = useState();

    useEffect(() => {
        console.log("RawMessageComponent")
        setReceivedType(topicList.find((value, index) => {
            console.log(value, index)
            if(value === receivedTopic){
                return index
            }
        }))

        const listener = new ROSLIB.Topic({
            ros: ros,
            name: receivedTopic,
            messageType: typeList[receivedType]
        });

        listener.subscribe((message) => {
            setMsg(message);
        })
        var topic = new ROSLIB.Topic({
            ros : ros,
            name: '/com/endpoint/example', // use a sensible namespace
            messageType: 'std_msgs/String'
          });

        function publishEncoded(topic, obj) {
              var msg = new ROSLIB.Message({
                data: JSON.stringify(obj)
              });
              topic.publish(msg);
            }
        }, []);

    return (
      <div style={{overflow: "auto"}}>
        {JSON.stringify(msg)}
      </div>
    )
}