import React, {useEffect, useState, useRef} from "react";
import ROSLIB from "roslib";
import Kakaomap from "./KaKaomap";
import Pcd_data from "./pcd_data";
import './static/App.css';
import ImuRender from "./ImuRender";

const App = () => {
    return(
        <div className="container">
            {/*<Kakaomap/>*/}
            {/*<Pcd_data/>*/}
            <ImuRender/>
        </div>
    )
}

export default App;