import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {checkedTopic} from "../features/PublishedTopics/PublishedTopicSlice";

export default function CheckBoxState () {
    // 체크한 값 업데이트
    const [checked, setChecked] = useState([]);
    const [getTopicList, setTopicList] = useState([]);
    const topicList = useSelector((state) => state.TopicList.topics.topic);
    const dispatch = useDispatch();

    // props 값 받아오기
    const handleCheck = (event) => {
        setChecked(prevChecked => {
            let updatedTopicList = [...prevChecked];
            if (event.target.checked) {
                updatedTopicList = [...prevChecked, event.target.value];
            } else {
                updatedTopicList.splice(prevChecked.indexOf(event.target.value), 1);
            }
            return updatedTopicList;
        });
    };

    return (
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            <div>
                <h5>All Topic : {topicList.length}</h5>
                <p>{topicList.map((state, index) => (
                    <div>
                        <input value={state.topic} key={index} type="checkbox" onChange={dispatch(checkedTopic(state))} width=""/>
                        <p>{state.topic} : {state.type}</p>
                    </div>
                ))}</p>

            </div>
            <div>
                <h5>Checked : {checked.length}</h5>
                {checked.map((value, index) => (
                    <div key={index}>
                        <p>
                            {value.topic}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}


