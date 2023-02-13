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


const imu_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/zed2/zed_node/imu/data',
    messageType: 'sensor_msgs/Imu'
});


function ImuRender () {

    const [img, setImg] = useState();

    useEffect(() => {
        const image_topic = new ROSLIB.Topic({
            ros: ros,
            name: '/zed2/zed_node/right/image_rect_color/compressed',
            messageType: 'sensor_msgs/CompressedImage'
        });
        image_topic.subscribe(function(message) {
            setImg("data:image/jpg;base64," + message.data);
        });
    });

    return(
      <div datasrc={img}>
          <img src={img}></img>
      </div>
    );
}

export default ImuRender;