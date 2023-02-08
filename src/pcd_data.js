import React, {Component, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Viewer, Grid, PointCloud2, UrdfClient} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const pcdlistener = new ROSLIB.Topic({
    ros : ros,
    name : '/velodyne_points',
    messageType : 'sensor_msgs/PointCloud2'
});

function MM(){
    const [msg, setMsg] = useState();

    ros.on("connection", () => {
        setMsg("Connected to websocket server.");
    });
    ros.on("error", () => {
        const error = "Error connecting to websocket server.";
        setMsg(error);
    });
    ros.on("close", () => {
        setMsg("Connection to websocket server closed.");
    });

    return (
        <div>
            <div>{msg}</div>
        </div>
    );
}
export default class Simulator extends React.Component {
    componentDidMount() {
        const viewer = new Viewer({
            divID : 'viewer',
            width: 900,
            height: 600,
            antialias : true,
            background : '#111111',
            longPressTolerance : 5
        });

        const tfClient = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame: 'velodyne',
        });

        const cloudClient = new ROS3D.PointCloud2({
            ros : ros,
            rootObject : viewer.scene,
            tfClient : tfClient,
            topic : '/velodyne_points',
            material : {size: 0.01, color: 0xff00ff },
            max_pts : 1000000
        });
    }

    render() {
        return (
            <div id="viewer">
            </div>
        );
    }
}

export {MM};