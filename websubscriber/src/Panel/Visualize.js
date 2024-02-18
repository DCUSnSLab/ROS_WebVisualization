'use client';
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import React, {useEffect, useRef, useState} from "react";
import VehicleReactChart from "../Component/VehicleReactChart";
import {ParentComponent} from "./AllTopicSub";
import './Visualize.css';
import {Tab, Tabs} from "react-bootstrap";

export default function Visualize(){

    return(
        <Tabs
            id="controlledTab"
            // activeKey={key}
            // onSelect={(k) => setKey(k)}
            className="mb3"
        >
            <Tab eventKey="AllTopic" title="AllTopic" style={{width: "window.innerWidth / 2"}}>
                <ParentComponent/>
            </Tab>
            <Tab eventKey="Camera" title="Camera" style={{width: "window.innerWidth / 2"}}>
                <ImageLR/>
            </Tab>
            <Tab eventKey="PointCloud2" title="PointCloud2" style={{width: "window.innerWidth / 2"}}>
                <PCL/>
            </Tab>
        </Tabs>
    );
}