import React, {Component, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Viewer, Grid, PointCloud2, UrdfClient} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
import * as THREE from 'three';


const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

ros.on("connection", () => {});
ros.on("error", () => {});
ros.on("close", () => {});


const image_R_topic = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2/zed_node/right/image_rect_color/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});

const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2/zed_node/left/image_rect_color/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});

function ImuRender () {

    const [Rimg, setRImg] = useState();
    const [Limg, setLImg] = useState();

        image_R_topic.subscribe(function(message) {
            setRImg("data:image/jpg;base64," + message.data);
        });
        image_L_topic.subscribe(function(message) {
            setLImg("data:image/jpg;base64," + message.data);
        });

    return(
      <div>
          <h3>right</h3>
          <img src={Rimg}></img>
          <h3>left</h3>
          <img src={Limg}></img>
      </div>
    );
}

export default ImuRender;