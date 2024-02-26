import './MainPage.css';
import React, {useEffect, useState} from "react";
import * as ROSLIB from "roslib";
import LeftSideBar from "./LeftSideBar";
import KakaomapLiveEditor from "../Component/kakaomap";
import Kakaomap from "../Component/kakaomap";
import Visualize from "./Visualize";
import { StyledEngineProvider } from '@mui/material/styles';
import {AddPostForm} from "../features/Post/AddPostForm";
// import Kakaomap, {KakaomapLiveEditor} from "../Component/kakaomap";


function MainPage(){


    return(
        <div id="container">
            <LeftSideBar id="LeftSideBar"/>
            <Kakaomap id="Kakaomap"/>
            {/*<KakaomapLiveEditor/>*/}
            <Visualize/>
        </div>
    );
}

export default MainPage;