import './MainPage.css';
import React, {useEffect, useState} from "react";
import Kakaomap from "../Component/kakaomap";
import Visualize from "./Visualize";

function MainPage(){

    return(
        <div id="container" style={{width: "100vw", height: "100vh"}}>
            <div style={{width: "50vw", height: "100vh"}}>
                <Kakaomap/>
            </div>
            <div style={{width: "50vw", height: "100vh"}}>
                <Visualize/>
            </div>
        </div>
    );
}

export default MainPage;