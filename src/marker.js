import React, {Component, useState} from 'react';
import {Viewer, Grid} from 'ros3d';
import ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
export default class Simulator extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const ros = new ROSLIB.Ros({
            url : 'wss://localhost:9090'
        });

        const viewer = new ROS3D.Viewer({
            divID : 'webViewer',
            width : 800,
            height : 600,
            antialias : true,
            background : '#111111'
        });

        ros.on("connection", () => {
            console.log("Connected to websocket server.");
        });
        ros.on("error", () => {
            const error = "Error connecting to websocket server.";
            console.log(error);
        });
        ros.on("close", () => {
            console.log("Connection to websocket server closed.");
        });

        viewer.addObject(new Grid());

        const tfClient = new ROSLIB.TFClient({
            ros : ros,
            angularThres : 0.01,
            transThres : 0.01,
            rate : 10.0
        });

        const tmpSub = new ROS3D.PointCloud2({
            ros: ros,
            rootObject: viewer.scene,
            tfClient: tfClient,
            topic: '/velodyne_points',
            material: {size: 0.01, color: 0xeeeeee }
        })
        function displayCloud(msg){
            tmpSub.processMessage(msg);
        }
        displayCloud();
    }
    render() {
        return (
            <div>
                <h1>Check MSG</h1>
                <div id="markers"/>
            </div>
        );
    }
}