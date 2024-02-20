import React, {useEffect, useRef, useState} from "react";

function NewCheckState ({props}) {
    // 체크한 값 업데이트
    const [checked, setChecked] = useState([]);
    const [getTopicList, setTopicList] = useState([]);

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
                <h5>All Topic : {getTopicList.length}</h5>
                {getTopicList && getTopicList.map((value, i) => (
                    <div>
                        <p>
                            <input value={value.topic} key={i} type="checkbox" onChange={handleCheck} width=""/>
                            <span key={i}>{value.topic} : {value.type}</span>
                        </p>
                    </div>
                ))}
            </div>
            <div>
                <h5>Checked : {checked.length}</h5>
                {checked.map((value, index) => (
                    <div key={index}>
                        <p>
                            {value.topic} : {getTopicList.find(topic => topic.topic === value.topic)?.type}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default NewCheckState;