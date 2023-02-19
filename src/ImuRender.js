import React, {Component, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Viewer, Grid, PointCloud2, UrdfClient, TFAxes, Arrow} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
import * as THREE from 'three';
import scene from "three/addons/offscreen/scene";

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const ImuRender = () => {
    useEffect(() => {
        const viewer = new ROS3D.Viewer({
            divID : 'viewer',
            width: 1000,
            height: 400,
            antialias : true,
            background : '#111111',
        });
        viewer.addObject(new ROS3D.Grid());

        // /tf tfclient 생성
        const ClientTF_tf = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'map',
            rootObject : viewer.scene
        });

        // tf 관계 정의
        const odomTF = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'odom',
            rootObject : viewer.scene
        });

        const baseTF = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'base_link',
            rootObject : viewer.scene
        });

        // zed2/zed_node/path_map 시각화
        const PathVisual = new ROS3D.Path({
            ros : ros,
            tfClient : baseTF,
            topic : '/zed2/zed_node/path_map',
            rootObject: viewer.scene
        })

        // zed2/zed_node/pose 시각화 전진방향
        const poseVisual = new ROS3D.Pose({
            ros : ros,
            tfClient : baseTF,
            topic : '/zed2/zed_node/pose',
            rootObject: viewer.scene
        })

        const imClient = new ROS3D.Odometry({
            ros : ros,
            tfClient : baseTF,
            topic : '/zed2/zed_node/odom',
            rootObject: viewer.scene
        })

    })

    return(
        <div>
            <div id='viewer'></div>
        </div>
    );
}
export default ImuRender;