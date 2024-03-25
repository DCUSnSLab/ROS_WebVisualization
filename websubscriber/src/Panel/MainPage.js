import './MainPage.css';
import React, {useEffect, useState} from "react";
import * as ROSLIB from "roslib";
import LeftSideBar from "./LeftSideBar";
import KakaomapLiveEditor from "../Component/kakaomap";
import Kakaomap from "../Component/kakaomap";
import Visualize from "./Visualize";
import {Button} from "react-bootstrap";
import { useSelector } from 'react-redux';


function MainPage(){

    return(
        <>
            <div id="container" style={{display: "grid", gridTemplateColumns: "50vw 50vw"}}>
                <Kakaomap id="Kakaomap"/>
                <Visualize/>
            </div>
        </>
    );
}

export default MainPage;