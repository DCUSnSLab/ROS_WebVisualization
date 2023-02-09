import React, {useEffect, useState, useRef} from "react";
import ROSLIB from "roslib";
import Kakaomap from "./KaKaomap";
import Pcd_data from "./pcd_data";
import './static/App.css';

const App = () => {
    return(
        <div className="container">
            <Kakaomap/>
            <Pcd_data/>
        </div>
    )
}

export default App;