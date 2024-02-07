import React, {useEffect, useState} from 'react';
import {Viewer, Grid, PointCloud2} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

export default function Simula(){
    useEffect(() => {
        let viewer = new Viewer({
          divID : 'viewer',
          width: 1000,
          height: 400,
          antialias : true,
          background : '#111111',
        });

        viewer.addObject(new Grid());

        const tfClient = new ROSLIB.TFClient({
              ros : ros,
              angularThres : 0.1,
              transThres : 0.1,
              rate : 10.0,
              fixedFrame: '/velodyne'
        });
          const cloudClient = new PointCloud2({
              ros : ros,
              rootObject : viewer.scene,
              tfClient : tfClient,
              topic : '/velodyne_points',
              material : {color: 0xff00ff, size: 0.05},
              max_pts : 30000
          });
    }, []);

    return(
        <div id="viewer"></div>
    );
}