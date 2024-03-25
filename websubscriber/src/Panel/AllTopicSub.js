import * as ROSLIB from "roslib";
import React, {useEffect, useState} from "react";
import CheckBoxState from "./CheckBoxState";
import { useSelector, useDispatch } from "react-redux";
import {checkedTopic, updatedTopic} from "../features/PublishedTopics/PublishedTopicSlice";

// 부모 컴포넌트
const ros = new ROSLIB.Ros({
    url : 'ws://203.250.33.143:9090'
});

export default function AllTopicSub(){
    const [topicListUp, setTopicListUp] = useState();
    const [checked, setChecked] = useState([]);

    const topicList = useSelector((state) => state.TopicList.topics.topic);
     // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    const dispatch = useDispatch();
    // store에 값을 업데이트 시켜달라고 요청하는 훅

    const topicsClient = new ROSLIB.Service({
        ros : ros,
        name : '/rosapi/topics',
        serviceType : 'rosapi/Topics'
    });

    useEffect(() => {
        const request = new ROSLIB.ServiceRequest();
            topicsClient.callService(request, function(result) {
                // result shape -> string[] topics / string[] types
            let topics = result.topics
            let types = result.types
            const updatedTopicList = topics.map((topic, index) => ({
                topic: topics[index],
                type: types[index]
              }))
            dispatch(updatedTopic(updatedTopicList))
            console.log(dispatch(updatedTopic(updatedTopicList)))
            setTopicListUp(updatedTopicList);
        });
    },[]);

    useEffect(() => {
        console.log(checked)
        console.log(topicList)
    }, [checked])

    const handleCheck = (event) => {
        setChecked(prevChecked => {
            let updatedTopicList = [...prevChecked];
            if (event.target.checked) {
                updatedTopicList = [...prevChecked, event.target.value];
            }
            else {
                updatedTopicList.splice(prevChecked.indexOf(event.target.value), 1);
            }
            return updatedTopicList;
        });
        dispatch(checkedTopic(checked))
    };

    // props 값 받아오기
    // return(
    //    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", height: "100vh"}}>
    //         <div>
    //             <h5>All Topic : {topicList.length}</h5>
    //             <p>{topicList.map((state, index) => (
    //                 <div>
    //                     <input value={state.topic} data-value2={state.type} id="myCheckbox" key={index} type="checkbox" onChange={handleCheck} width=""/>
    //                     <p>{state.topic} : {state.type}</p>
    //                 </div>
    //             ))}</p>
    //         </div>
    //     </div>
    // )
}