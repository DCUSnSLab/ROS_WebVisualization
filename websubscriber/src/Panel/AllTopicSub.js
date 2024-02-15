import * as ROSLIB from "roslib";
import React, {useEffect, useState} from "react";
import CheckBoxState from "./CheckBoxState";


const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

export default function AllTopicSub(){

    const [upTopic, setUpTopic] = useState([]);
    const [upType, setUpType] = useState([]);
    const [topicListUp, setTopicListUp] = useState([]);

    const topicsClient = new ROSLIB.Service({
        ros : ros,
        name : '/rosapi/topics',
        serviceType : 'rosapi/Topics'
    });

    useEffect(() => {
        const request = new ROSLIB.ServiceRequest();
        topicsClient.callService(request, function(result) {
            // reulst shape -> string[] topics / string[] types
        const updatedTopicList = result.topics.map((topic, index) => ({
            topic: topic,
            type: result.types[index]
          }));
        setTopicListUp(updatedTopicList);
        console.log(topicListUp)
        console.log(topicListUp.length)
        });
    }, []);

    const [checked, setChecked] = useState([]);
    const handleCheck = (event) => {
        let updatedList = [...checked];
        if (event.target.checked) {
            updatedList = [...checked, event.target.value];
        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
    };

    const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";


    return(
        // 시각화
        // <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
        //     {topicListUp.map((value, i) => (
        //         <div>
        //             <p key={i}>
        //                 {/*<input value={value.topic} type="checkbox" onChange={handleCheck} width=""/>*/}
        //                 <span>{value.topic} : {value.type}</span>
        //             </p>
        //             {/*todo 각 토픽과 타입 옆에 체크박스 기능 구현 및 상태 관리 필요*/}
        //         </div>
        //     ))}
        // </div>
        // topicListUp.map((value, i) => (
        //     [value.topic, value.type]
        // ))
        <p>
            {/*<input value={value.topic} type="checkbox" onChange={handleCheck} width=""/>*/}
            <span>{topicListUp.topic} : {topicListUp.type}</span>
        </p>
    )
}