'use client';
import React, {useEffect, useRef, useState} from "react";
import './Visualize.css';
import {Button, Tab, Tabs} from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import {checkedTopic} from "../features/PublishedTopics/PublishedTopicSlice";
import {useDispatch, useSelector} from "react-redux";
import * as ROSLIB from "roslib";
import AllTopicSub from "./AllTopicSub";
import 'react-resizable/css/styles.css';
import {Rnd} from "react-rnd";
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";

import { Resizable } from 're-resizable';

// 부모 컴포넌트
const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

export default function Visualize(){
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

    const panelSelectList = (setSelectedPanel) => (
        <select onChange={(event) => setSelectedPanel(event.target.value)}>
            <option value="">Visualization Tools</option>
            <option value="Image">Image</option>
            <option value="PointCloud">PointCloud</option>
            <option value="Chart">Chart</option>
            <option value="RawMessage">RawMessage</option>
        </select>
    );

    const VisualizationComponent = ({ panelType, topic, width, height }) => {
        const commonProps = { width, height };

        switch (panelType) {
            case 'Image':
                return <ImageLR topic={topic} {...commonProps}/>;
            case 'PointCloud':
                return <PCL topic={topic} {...commonProps}/>;
            case 'Chart':
                // return <Chart/>;
            case 'RawMessage':
                // return <RawMessageComponent topic={topic} />;
            default:
                return null;
        }
    };

   const topicSelectList = (setSelectedTopic) => {
        return(
            <div>
                <AllTopicSub/>
                <select onChange={(event) => setSelectedTopic(event.target.value)}>
                    <option value="">Published Topic</option>
                    {topicList.map((state, index) => (
                        <option key={index} value={state.topic}>
                            {state.topic}
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    const addCard = () => {
        const newCard = {
            id: Date.now(),
            topics: [...checked],
            selectedTopic: topicList?.topic,
        };

        newCard.setSelectedTopic = (topic) => {
            newCard.selectedTopic = topic;
        };

        newCard.setSelectedPanel = (panel) => {
            newCard.selectedPanel = panel;
        };

        newCard.component = (
            <Card style={{ width: '10rem' }}>
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
                    <Card.Title>Visualization Tools</Card.Title>
                    <Card.Text>
                        {topicSelectList(newCard.setSelectedTopic)}
                    </Card.Text>
                </Card.Body>
            </Card>
        );

        setCards(prevCards => [...prevCards, newCard]);
    };

    const deleteCard = (id) => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
    };

    return(
        <div style={{height: '100%', width: '80vw'}}>
            <div id="threeBtn" style={{height: "60px"}}>
                <Button variant="outline-dark">LOGGING</Button>
                <Button variant="outline-success">START</Button>
                <Button variant="outline-danger">STOP</Button>
            </div>
            <Tabs>
                <Tab eventKey="Vehicle1" title="Vehicle1">
                    <div id="newPanelBtn" style={{display: "inline-block"}}>
                        <Button variant="outline-primary" onClick={addCard}>
                            Add New Panel
                        </Button>
                        {cards.map((card, index) => (
                            <Rnd
                                default={{
                                    x: 0,
                                    y: 0,
                                    width: 450,
                                    height: 200,
                                }}
                                minWidth={450}
                                minHeight={200}
                                maxWidth={600}
                                maxHeight={400}
                                style={{backgroundColor: 'black', padding: "10px"}}
                            >
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
                                {panelSelectList(card.setSelectedPanel)}
                                {topicSelectList(card.setSelectedTopic)}
                                {card.selectedTopic && card.selectedPanel && <VisualizationComponent panelType={card.selectedPanel} topic={card.selectedTopic} />}
                            </Rnd>
                        ))}
                      </div>
                </Tab>
                    <Button variant="primary" onClick={addCard}>Add New Panel</Button>
            </Tabs>
        </div>
    );
}