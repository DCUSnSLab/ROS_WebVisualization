import * as ROSLIB from "roslib";
import {useEffect, useState} from "react";


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


    return(
        // 시각화
        // <>
        //     {topicListUp.map((value, i) => (
        //         <>
        //             <p key={i}>{value.topic} : {value.type}</p>
        //             {/*todo 각 토픽과 타입 옆에 체크박스 기능 구현 및 상태 관리 필요*/}
        //             <label>
        //                 {/*<input id={id} type="checkbox" checked={bChecked} onChange={(e) => checkHandled(e)}/>*/}
        //             </label>
        //         </>
        //     ))}
        // </>
        {/*todo 그냥 값만 주는 걸 어떻게 해야할까 체크박스하고 리턴하고 나눠야하나*/}
        // topicListUp.map((value, i) => (
        //     [value.topic, value.type]
        // ))
    )
}