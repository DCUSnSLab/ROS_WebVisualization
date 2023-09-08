import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const ImuRender = () => {

    useEffect(() => {
        const viewer = new ROS3D.Viewer({
            divID : 'viewer',
            width: 1200,
            height: 900,
            antialias : true,
            background : '#111111',
        });
        viewer.addObject(new ROS3D.Grid());

        // /tf tfclient 생성
        const ClientTF_tf = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'map',
            angularThres : 0.01,
            transThres : 0.01,
            // rate : 1초에 50번 publish 받는다. 그래서 깜빡깜빡 보인다.
            rate : 50.0,
            rootObject : viewer.scene
        });

        const odomTF = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'odom',
            tfClient : ClientTF_tf,
            rootObject : viewer.scene
        });

        const baseTF = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'base_link',
            tfClient : odomTF,
            rootObject : viewer.scene

        });

        const imulink = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame : 'zed2_imu_link',
            rootObject : viewer.scene
        })

        // zed2/zed_node/path_map 시각화
        const PathVisual = new ROS3D.Path({
            ros : ros,
            tfClient : baseTF,
            topic : '/zed2/zed_node/path_map',
            rootObject: viewer.scene
        })

        const poseVisual = new ROS3D.Pose({
            ros : ros,
            topic : '/zed2/zed_node/pose',
            tfClient : baseTF,
            rootObject: viewer.scene
        })

        const imClient = new ROS3D.Odometry({
            ros : ros,
            tfClient : odomTF,
            topic : '/zed2/zed_node/odom',
            rootObject: viewer.scene
        })

    }, [])

    return(
        <div>
            <div id='viewer'></div>
        </div>
    );
}
export default ImuRender;
