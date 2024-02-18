import * as ROSLIB from "roslib";
import React, {useEffect, useState} from "react";
import CheckBoxState from "./CheckBoxState";

// 부모 컴포넌트

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

export function ParentComponent(){

    const [topicListUp, setTopicListUp] = useState();
    const [returnTopicList, setReturnTopicList] = useState();

    const topicsClient = new ROSLIB.Service({
        ros : ros,
        name : '/rosapi/topics',
        serviceType : 'rosapi/Topics'
    });

    useEffect(() => {
        const request = new ROSLIB.ServiceRequest();
        topicsClient.callService(request, function(result) {
            console.log(result)

            // result shape -> string[] topics / string[] types
            let topics = result.topics
            let types = result.types
            console.log(topics)
            console.log(types)
            const updatedTopicList = topics.map((topic, index) => ({
                topic: topic,
                type: types[index]
              }))
            setTopicListUp(updatedTopicList);
        });
    },[]);

    useEffect(() => {
        setReturnTopicList(topicListUp)
    }, [topicListUp])

    return(
        <div style={{overflow: "auto"}}>
            {returnTopicList && <CheckBoxState props={returnTopicList}/>}
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
// export function ChildComponent(props) {
//
//     const [checked, setChecked] = useState([]);
//
//     const handleCheck = (event) => {
//         let updatedList = [...checked];
//         if (event.target.checked) {
//             updatedList = [...checked, event.target.value];
//         } else {
//             updatedList.splice(checked.indexOf(event.target.value), 1);
//         }
//         setChecked(updatedList);
//     };
//
//     // 문제 : 원래 props를 useState를 사용해서 받아올려고 했지만 계속해서 re-render 오류가 남
//     // 원인 : 상위 구성 요소의 재렌더링이 하위 구성 요소의 재렌더링을 트리거하고 이 주기가 계속 반복될 때 발생
//     // ChildComponent에서 렌더링하면, ChildComponent가 포함되어있는 ParentComponent의 렌더링이 트리거 됨
//     // 또한, 부모가 다시 렌더링하면 React의 렌더링 프로세스 구조로 인해 자식이 다시 다시 렌더링 됨
//     let p = props.props
//     // let을 사용한 변수 선언은 re-render 오류를 일시적으로 해결, 상태 관리의 이점을 제공하지 않으므로 주의가 필요
//
//     return(
//         <div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
//             <div>
//                 {p.map((value, i) => (
//                     <div key={i}>
//                         <p key={i}>
//                             <input value={value.topic} type="checkbox" onChange={handleCheck} width=""/>
//                             <span>{value.topic} : {value.type}</span>
//                         </p>
//                         {/*todo 각 토픽과 타입 옆에 체크박스 기능 구현 및 상태 관리 필요*/}
//                     </div>
//                 ))}
//             </div>
//             <h5>Checked : {checked}</h5>
//         </div>
//     )
// }
