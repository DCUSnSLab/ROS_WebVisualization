import React, {useEffect, useState} from 'react';
import {Viewer, Grid, PointCloud2} from 'ros3d';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

export default function PCL({topic}){

    useEffect(() => {

        const receivedTopic = topic

        let viewer = new Viewer({
            divID : 'viewer',
            width: window.innerWidth / 4,
            height: window.innerHeight / 4,
            antialias : true,
            background : '#111111'
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
              topic : receivedTopic,
              material : {color: 0xff00ff, size: 0.05},
              max_pts : 30000
          });
    }, []);

    return(
        <div id="viewer"></div>
    );
}