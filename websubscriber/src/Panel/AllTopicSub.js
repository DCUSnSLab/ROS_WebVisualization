import * as ROSLIB from "roslib";
import React, {useContext, useEffect, useState} from "react";
import CheckBoxState from "./CheckBoxState";
import { useSelector, useDispatch } from "react-redux";
import {checkedTopic, updatedGPS, updatedTopic} from "../features/PublishedTopics/PublishedTopicSlice";
import {ROSContext, useROS} from "../ROSContext";


export default function AllTopicSub(){

    const [checked, setChecked] = useState([]);

    const topicList = useSelector((state) => state.TopicList.topics.topic);

    const dispatch = useDispatch();

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        console.log("AllTopicSub")

        const topicsClient = new ROSLIB.Service({
            ros : ros,
            name: '/_rosapi/topics_and_types',
            serviceType: 'rosapi_msgs/srv/TopicsAndTypes'
        });

        const request = new ROSLIB.ServiceRequest();

        topicsClient.callService(request, function(result) {
            const updatedTopicList = result.topics.map((topic, index) => ({
                topic: topic,
                type: result.types[index]
            }));
            dispatch(updatedTopic(updatedTopicList));
            console.log(updatedTopicList);
        });

        return () => {
            ros.close();
        };
    },[ip, dispatch]);


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