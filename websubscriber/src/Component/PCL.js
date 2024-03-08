import React, {useEffect, useState} from 'react';
import {Viewer, Grid, PointCloud2} from 'ros3d';
import * as ROSLIB from 'roslib';
import {TextField} from "@mui/material";
import {useSelector} from "react-redux";


  const ros = new ROSLIB.Ros({
        url : 'ws://203.250.33.143:9090'
  });


export default function PCL({topic}){


  // const ip = useSelector((state) => state.TopicList.serverIP);
  // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    useEffect(() => {

        const receivedTopic = topic

        let viewer = new Viewer({
            divID : 'viewer',
            width: 400,
            height: 200,
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