'use client';
import React, {useEffect, useRef, useState} from "react";
import './Visualize.css';
import {Button, Tab, Tabs} from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import {checkedTopic} from "../features/PublishedTopics/PublishedTopicSlice";
import {useDispatch, useSelector} from "react-redux";
import * as ROSLIB from "roslib";
import AllTopicSub from "./AllTopicSub";


// 부모 컴포넌트
const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});
function VisualizationComponent({ topic }) {

}

export default function Visualize(){
    const [topicListUp, setTopicListUp] = useState();
    const [checked, setChecked] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const topicList = useSelector((state) => state.TopicList.topics.topic);
     // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅
    const selectedTopics = useSelector(state => state.TopicList.selectedTopics);  // store에서 선택된 토픽을 가져옴

    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const handleTopicSelect = (event) => {
        setSelectedTopic(event.target.value);
    };

    const topicSelectList = () => {
        return(
            <div>
                <AllTopicSub/>
                <h5>All Topic : {topicList.length}</h5>
                <p>{topicList.map((state, index) => (
                    <div key={index}>
                        <input
                            value={state.topic}
                            type="radio"
                            onChange={handleTopicSelect}
                            name="topicSelect"
                        />
                        <label>{state.topic} : {state.type}</label>
                    </div>
                ))}</p>
            </div>
        )
    }
    // 새로운 Card 추가 함수 정의
    // 새로운 Card 추가 함수 정의
    const addCard = () => {
        const newCard = {
            id: Date.now(),  // 현재 시간을 id로 사용
            topics: [...checked],  // 현재 체크된 토픽들 복사
        };

        newCard.setSelectedTopic = (topic) => {  // 토픽 선택 핸들러
            dispatch(setSelectedTopic({id: newCard.id, topic}));  // 선택된 토픽을 store에 저장
        };

        newCard.component = (
            <Card style={{ width: '18rem' }}>
                <Button
                variant="danger"
                onClick={() => deleteCard(newCard.id)}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '5px',
                    fontSize: '16px',
                    lineHeight: '1',
                    width: 'auto',
                    height: 'auto',
                }}
            >
                X
            </Button>
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        {topicSelectList(newCard.setSelectedTopic)}
                    </Card.Text>
                    {/* 토픽 선택 리스트 */}
                </Card.Body>
            </Card>
        );

        setCards(prevCards => [...prevCards, newCard]);
    };

    const deleteCard = (id) => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
    };

    return(
        <div style={{height: '50vh', width: '80vw'}}>
            <div style={{height: "35px"}}>
                <button>START</button>
                <button>STOP</button>
                <button>LOGGING</button>
            </div>
            <Tabs>
                <Tab eventKey="Vehicle1" title="Vehicle1">
                    <div style={{ overflow: "auto"}}>
                        <Button variant="primary" onClick={addCard}>Add New Panel</Button>
                        {cards.map((card, index) => (
                          <Card key={index} style={{ width: '20vw', height: '30vh', position: 'relative',  overflow: "auto"}}>
                            <Button
                              variant="danger"
                              onClick={() => deleteCard(card.id)}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                padding: '5px',
                                fontSize: '16px',
                                lineHeight: '1',
                                width: 'auto',
                                height: 'auto',
                              }}
                            >
                              X
                            </Button>
                            <Card.Body>
                              <Card.Title>Card Title</Card.Title>
                              {/* 토픽 선택 리스트 */}
                              {topicSelectList(card.setSelectedTopic)}
                              {/* 선택된 토픽에 대한 시각화 */}
                              {selectedTopics[card.id] && <VisualizationComponent topic={selectedTopics[card.id]} />}
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                </Tab>
                    <Button variant="primary" onClick={addCard}>Add New Panel</Button>
                {/* ... */}
            </Tabs>
        </div>
    );
}