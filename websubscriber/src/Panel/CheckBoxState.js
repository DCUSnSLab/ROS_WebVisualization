import React, {useEffect, useRef, useState} from "react";

export default function CheckBoxState ({props}){
    // 체크한 값 업데이트
    const [checked, setChecked] = useState([]);
    const [prevChecked, setprevChecked] = useRef([]);
    const [getTopicList, setTopicList] = useState([]);

    // props 값 받아오기
    useEffect(() => {
        setTopicList(props)
    }, []);

    // useEffect(() => {
    //     // 현재 상태를 이전 상태에 저장
    //     prevChecked.current = checked.value.topic;
    // }, [checked]); // state가 변경될 때마다 실행

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


    // 문제 : 원래 props를 useState를 사용해서 받아올려고 했지만 계속해서 re-render 오류가 남
    // 원인 : 상위 구성 요소의 재렌더링이 하위 구성 요소의 재렌더링을 트리거하고 이 주기가 계속 반복될 때 발생
    // ChildComponent에서 렌더링하면, ChildComponent가 포함되어있는 ParentComponent의 렌더링이 트리거 됨
    // 또한, 부모가 다시 렌더링하면 React의 렌더링 프로세스 구조로 인해 자식이 다시 다시 렌더링 됨

    // let을 사용한 변수 선언은 re-render 오류를 일시적으로 해결, 상태 관리의 이점을 제공하지 않으므로 주의가 필요
    // 해결 : 해당 문제는 부모와 자식이 같은 props가 아닌 별개의 props를 쓰게해서 해결함

    return(
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
                    // <div key={value}>
                    //     <p key={value}>{value} : {getTopicList.type[index]}</p>
                    //  </div>
                    <div key={index}> {/* key는 고유해 하므로 index를 사용하는 것이 좋습니다. */}
                        <p>
                            {value.topic} : {getTopicList.find(topic => topic.topic === value.topic)?.type}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
