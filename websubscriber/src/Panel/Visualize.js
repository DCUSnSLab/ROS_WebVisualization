'use client';
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import React, {useEffect, useRef, useState} from "react";
import VehicleReactChart from "../Component/VehicleReactChart";
import './Visualize.css';
import {Tab, Tabs} from "react-bootstrap";
import AllTopicSub from "./AllTopicSub";

export default function Visualize(){

    return(
        <Tabs
            id="controlledTab"
            // activeKey={key}
            // onSelect={(k) => setKey(k)}
            className="mb3"
            style={{width: "window.innerWidth / 2"}}
        >
            <Tab eventKey="Vehicle1" title="Vehicle1" style={{width: "window.innerWidth / 2"}}>
                {/*<ImageLR/>*/}
                {/*<PCL/>*/}
                <AllTopicSub/>
            </Tab>
            <Tabs eventKey="Vehicle2" title="Vehicle2" style={{width: "window.innerWidth / 2"}}>
            </Tabs>
            <Tabs eventKey="Vehicle3" title="Vehicle3" style={{width: "window.innerWidth / 2"}}>
            </Tabs>
        </Tabs>
    );
}