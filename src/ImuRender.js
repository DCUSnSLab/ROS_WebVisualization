import React, {Component, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Viewer, Grid, PointCloud2, UrdfClient, TFAxes} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
import * as THREE from 'three';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const ImuRender = () => {

    useEffect(() => {

        const viewer = new Viewer({
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
            topic : '/tf',
            messageType: 'tf2_msgs/TFMessage'
        })
        viewer.addObject(new ROS3D.Axes());

        // /zed2/zed_node/path_map 시각화
        const PathVisualize = new ROS3D.Path({
            ros : ros,
            //tf
            tfClient: ClientTF_tf,
            //frame setting
            // fixedFrame: 'map',
            topic : '/zed2/zed_node/path_map',
            rootObject: viewer.scene
        })

        // /zed2/zed_node/pose 시각화 전진방향
        const poseVisualize = new ROS3D.Pose({
            ros : ros,
            //tf
            tfClient : ClientTF_tf,
            //frame setting
            // fixedFrame: 'odom',
            topic : '/zed2/zed_node/pose',
            rootObject: viewer.scene
        })

        const odomClient = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'odom'
        })


        //odom visualize working
        const odomVisualize = new ROS3D.Odometry({
            ros : ros,
            topic : '/zed2/zed_node/odom',
            tfClient: odomClient,
            rootObject : viewer.scene
        })

    })

    return(
        <div>
            <h2>IMU</h2>
            <div id='viewer'></div>
            <div></div>
        </div>
    );
}
export default ImuRender;