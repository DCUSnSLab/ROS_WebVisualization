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

import RawMessageComponent from "../Component/RawMessageComponent";

import {
  getPanelElement,
  getPanelGroupElement,
  getResizeHandleElement,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";


export default function Visualize_resizable_panel(){

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅
    //
    // const ros = new ROSLIB.Ros({
    //     url : ip
    // });
    
    const [checked, setChecked] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const topicList = useSelector((state) => state.TopicList.topics.topic);
     // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅
    const selectedTopics = useSelector(state => state.TopicList.selectedTopics);  // store에서 선택된 토픽을 가져옴

    const dispatch = useDispatch();

    const [cards, setCards] = useState([]);

    const panelSelectList = (setSelectedPanel) => (
        <select onChange={(event) => setSelectedPanel(event.target.value)}>
            <option value="">Visualization Tools</option>
            <option value="Image">Image</option>
            <option value="PointCloud">PointCloud</option>
            <option value="Chart">Chart</option>
            <option value="RawMessage">RawMessage</option>
        </select>
    );

    const VisualizationComponent = ({ panelType, topic }) => {

        switch (panelType) {
            case 'Image':
                return <ImageLR topic={topic}/>;
            case 'PointCloud':
                return <PCL className="cancel" topic={topic}/>;
            case 'Chart':
                // return <Chart/>;
            case 'RawMessage':
                return <RawMessageComponent topic={topic}/>;
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
            width: 400,
            height: 200
        };

        newCard.setSelectedTopic = (topic) => {
            newCard.selectedTopic = topic;
        };

        newCard.setSize = (width, height) => {
            newCard.width = width;
            newCard.height = height;
        };

        newCard.setSelectedPanel = (panel) => {
            newCard.selectedPanel = panel;
        };

        newCard.component = (
            <div>
            <Button
                variant="danger"
                onClick={() => deleteCard(newCard.id)}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '5px',
                    fontSize: '16px',
                    lineHeight: '1'
                }}
            >X</Button>
                {topicSelectList(newCard.setSelectedTopic)}
            </div>
        );

        setCards(prevCards => [...prevCards, newCard]);
    };

    const deleteCard = (id) => {
        setCards(prevCards => prevCards.filter(card => card.id !== id))
    };
const refs = useRef();

  useEffect(() => {
    const groupElement = getPanelGroupElement("group");
    const leftPanelElement = getPanelElement("left-panel");
    const rightPanelElement = getPanelElement("right-panel");
    const resizeHandleElement = getResizeHandleElement("resize-handle");

    // If you want to, you can store them in a ref to pass around
    refs.current = {
      groupElement,
      leftPanelElement,
      rightPanelElement,
      resizeHandleElement,
    };
  }, []);

    return(
        <div style={{height: '100%', width: '80vw'}}>
            <div id="threeBtn" style={{height: "60px"}}>
                <Button variant="outline-dark">LOGGING</Button>
                <Button variant="outline-success">START</Button>
                <Button variant="outline-danger">STOP</Button>
            </div>
            <Tabs>
                <Tab className="coloredTab" eventKey="Vehicle1" title="Vehicle1" style={{height: "auto"}}>
                    <div id="newPanelBtn" style={{display: "inline-block"}}>
                        <Button variant="outline-primary" onClick={addCard}>
                            +
                        </Button>
                        {cards.map((card, index) => (
                            <div>
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
                            </div>
                        ))}
                      </div>
                </Tab>
                    <Button variant="primary" onClick={addCard}>Add New Panel</Button>
            </Tabs>
        </div>
    );
}