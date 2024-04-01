import './MainPage.css';
import React, {useEffect, useState} from "react";
import Kakaomap from "../Component/kakaomap";
import Visualize from "./Visualize";
function MainPage(){
    return(
        <>
            <div id="container" style={{display: "grid", gridTemplateColumns: "50vw 50vw"}}>
                <Kakaomap/>
                <Visualize/>
            </div>
        </>
    );
}

export default MainPage;