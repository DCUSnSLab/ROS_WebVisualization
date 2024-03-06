import './MainPage.css';
import React, {useEffect, useState} from "react";
import * as ROSLIB from "roslib";
import LeftSideBar from "./LeftSideBar";
import KakaomapLiveEditor from "../Component/kakaomap";
import Kakaomap from "../Component/kakaomap";
import Visualize from "./Visualize";
import { StyledEngineProvider } from '@mui/material/styles';
import {AddPostForm} from "../features/Panel/AddPostForm";
import VehicleStatus from "../Component/vehicleStatus";
import Visualize_resizable_panel from "./visualize_resizable_panel";


function MainPage(){

    return(
        <div id="container" style={{display: "grid", gridTemplateColumns: "100px 50vw 50vw"}}>
            <VehicleStatus/>
            <Kakaomap id="Kakaomap"/>
            {/*<KakaomapLiveEditor/>*/}
            <Visualize/>
        </div>
    );
}

export default MainPage;