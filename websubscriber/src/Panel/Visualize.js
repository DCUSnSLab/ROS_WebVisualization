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

import RosbagRecord from "./RosbagRecord";
import {addPanel, deletePanel, PanelSlice} from "../features/Panel/PanelSlice";
import VehicleControl from "./VehicleControl";
import LeftSideBar from "./LeftSideBar";
import DrivingVehicleList from "../Component/DrivingVehicleList";
import VehicleStatus from "../Component/vehicleStatus";

export default function Visualize(){

    const [checked, setChecked] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const topicList = useSelector((state) => state.TopicList.topics.topic);
     // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    const dispatch = useDispatch();

    const panelRedux = useSelector((state) => state.PanelList)

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
          height: "auto"
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
          <Card style={{ height: newCard.height }}>
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
            >
              X
            </Button>
            <Card.Body style={{ width: "100%", height: newCard.height }}>
              <Card.Title>Visualization Tools</Card.Title>
              <Card.Text style={{ width: "100%", height: newCard.height }}>
                {topicSelectList(newCard.setSelectedTopic)}
              </Card.Text>
            </Card.Body>
          </Card>
        );
        setCards(prevCards => [...prevCards, newCard]);
        };

        const deleteCard = (id) => {
            setCards((prevCards) => {
            const updatedCards = prevCards.filter((card) => card.id !== id);
                return updatedCards;
            });
        };

    return(
        <div style={{ height: '100%', width: '80vw' }}>
        <Tabs>
            <Tab className="coloredTab" eventKey="Vehicle1" title="Vehicle1" style={{ minHeight: "100vh" }}>
                <div id="newPanelBtn" style={{ display: "inline-block" }}>
                    <Button variant="primary" onClick={addCard} style={{ position: 'fixed', top: '55px', right: '10px'}}>
                        +
                    </Button>
                    <div id="threeBtn" style={{ marginLeft: 'auto', height: "80px", display: "inline-block"}}>
                        <RosbagRecord />
                        <VehicleControl />
                        <VehicleStatus/>
                    </div>
                    {cards.map((card, index) => (
                        <Rnd
                            key={card.id}
                            cancel=".cancel"
                            default={{
                              x: 15,
                              y: 75,
                              width: card.width,
                              height: card.height,
                            }}
                            enableUserSelectHack="true"
                            minWidth={450}
                            minHeight={100}
                            maxHeight={700}
                            style={{ backgroundColor: 'white', padding: "10px" }}
                            onResizeStop={(e, direction, ref) => {
                              card.setSize(ref.offsetWidth, ref.offsetHeight);
                            }}
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
                            <div className="cancel">
                                {card.selectedTopic && card.selectedPanel && <VisualizationComponent panelType={card.selectedPanel} topic={card.selectedTopic} width={card.width} height={card.height} />}
                            </div>
                        </Rnd>
                    ))}
                </div>
            </Tab>
            <Button variant="primary" onClick={addCard}>Add New Panel</Button>
        </Tabs>
    </div>
    );
}