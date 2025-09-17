import './MainPage.css';
import React, {useEffect, useState} from "react";
import Kakaomap from "../Component/kakaomap";
import Visualize from "./Visualize";
import {FaAngleDown} from "react-icons/fa";

function MainPage(){

    return(
        <div id="container">
            <Kakaomap/>
            <Visualize/>
        </div>
    );
}

export default MainPage;