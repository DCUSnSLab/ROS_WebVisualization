'use client';
import ImageLR from "../Component/ImageLR";
import PCL from "../Component/PCL";
import React, {useEffect, useRef, useState} from "react";
import VehicleReactChart from "../Component/VehicleReactChart";
import AllTopicSub, { ParentComponent} from "./AllTopicSub";
import './Visualize.css';
import {Box} from "@mui/material";
import {Tab, Tabs} from "react-bootstrap";

export default function Visualize(){

  const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Tabs
            id="controlledTab"
            // activeKey={key}
            // onSelect={(k) => setKey(k)}
            className="mb3"
        >
            <Tab eventKey="AllTopic" title="AllTopic">
                <ParentComponent/>
            </Tab>
            <Tab eventKey="Camera" title="Camera">
                <ImageLR/>
            </Tab>
            <Tab eventKey="PointCloud2" title="PointCloud2">
                <PCL/>
            </Tab>
        </Tabs>
    );
}