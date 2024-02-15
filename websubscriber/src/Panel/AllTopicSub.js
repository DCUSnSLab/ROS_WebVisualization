import * as ROSLIB from "roslib";
import React, {useEffect, useState} from "react";
import CheckBoxState from "./CheckBoxState";


const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

// 부모 컴포넌트


export function ParentComponent(){

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
              }))

            setTopicListUp(updatedTopicList);
            console.log(topicListUp)
        });
    }, [topicListUp]);

    return(
        <div>
            <ChildComponent props={topicListUp}/>
        </div>
    )
        // 시각화
        // <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
        //     {topicListUp.map((value, i) => (
        //         <div>
        //             <p key={i}>
        //                 {/*<input value={value.topic} type="checkbox" onChange={handleCheck} width=""/>*/}
        //                 {/*<span>{value.topic} : {value.type}</span>*/}
        //
        //             </p>
        //             {/*todo 각 토픽과 타입 옆에 체크박스 기능 구현 및 상태 관리 필요*/}
        //         </div>
        //     ))}
        // </div>
}

// 자식 컴포넌트
export function ChildComponent(props) {

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

    // 문제 : 원래 props를 useState를 사용해서 받아올려고 했지만 계속해서 re-render 오류가 남
    // 원인 : 상위 구성 요소의 재렌더링이 하위 구성 요소의 재렌더링을 트리거하고 이 주기가 계속 반복될 때 발생
    // ChildComponent에서 렌더링하면, ChildComponent가 포함되어있는 ParentComponent의 렌더링이 트리거 됨
    // 또한, 부모가 다시 렌더링하면 React의 렌더링 프로세스 구조로 인해 자식이 다시 다시 렌더링 됨
    let p = props.props

    return(
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            {p.map((value, i) => (
                <div>
                    <p key={i}>
                        <input value={value.topic} type="checkbox" onChange={handleCheck} width=""/>
                        <span>{value.topic} : {value.type}</span>
                    </p>
                    {/*todo 각 토픽과 타입 옆에 체크박스 기능 구현 및 상태 관리 필요*/}
                </div>
            ))}
        </div>
    )
}
