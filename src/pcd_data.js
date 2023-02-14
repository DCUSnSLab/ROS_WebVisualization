import React, {Component, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Viewer, Grid, PointCloud2, UrdfClient} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
import * as THREE from 'three';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});



function Simula(){

    useEffect(() => {
        const viewer = new Viewer({
            divID : 'viewer',
            width: 500,
            height: 400,
            antialias : true,
            background : '#111111',
        });
        viewer.addObject(new ROS3D.Grid());

        const tfClient = new ROSLIB.TFClient({
            ros : ros,
            fixedFrame: '/velodyne',
        });

        const cloudClient = new ROS3D.PointCloud2({
            ros : ros,
            rootObject : viewer.scene,
            tfClient : tfClient,
            topic : '/velodyne_points',
            material : {size: 0.01, color: 0xff00ff },
            max_pts : 50000
        });

    });

    return(
        <>
            <h2>/velodyne_points</h2>
            <div id="viewer"></div>
        </>
    );
}

export default React.memo(Simula);

//
// export default class Simulator extends Component {
//     componentDidMount() {
//         const viewer = new Viewer({
//             divID : 'viewer',
//             width: 500,
//             height: 400,
//             antialias : true,
//             background : '#111111',
//         });
//
//         const tfClient = new ROSLIB.TFClient({
//             ros : ros,
//             fixedFrame: 'velodyne',
//         });
//
//         const cloudClient = new ROS3D.PointCloud2({
//             ros : ros,
//             rootObject : viewer.scene,
//             tfClient : tfClient,
//             topic : '/velodyne_points',
//             material : {size: 0.01, color: 0xff00ff },
//             max_pts : 50000
//         });
//     }
//
//     render() {
//         return (
//             <div>
//                 <h2>/velodyne_points</h2>
//                 <div id="viewer">
//                 </div>
//             </div>
//         );
//     }
// }
