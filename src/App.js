import React, {useEffect, useState, useRef} from "react";
import Kakaomap from "./KaKaomap";
import Pcd_data from "./pcd_data";
import './static/App.css';
import ImuRender from "./ImuRender";
import * as ROSLIB from 'roslib';
import ImageLR from "./ImageLR";
import PoseXYZ from "./poseXYZ";

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const App = () => {

    ros.on("connection", () => {});
    ros.on("error", () => {});
    ros.on("close", () => {});

    return(
        <div className="container">
            {/* frame XYZ*/}
            {/*<PoseXYZ/>*/}

            {/*3D => path_map, pose */}
            <ImuRender/>

            {/* gps data visualization*/}
            {/*<Kakaomap/>*/}

            {/* velodyne point cloud visualization */}
            {/*<Pcd_data/>*/}

            {/* left && right compressedImage visualization  */}
            {/*<ImageLR/>*/}
        </div>
    )
}

export default App;