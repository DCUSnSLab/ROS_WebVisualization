import React, {useEffect, useState} from 'react';
import {Viewer, Grid, PointCloud2} from 'ros3d';
import * as ROSLIB from 'roslib';
import {TextField} from "@mui/material";
import {useSelector} from "react-redux";




export default function PCL({topic}){

    let ReduxRos = useSelector((state) => state.ipServer.VisualizeSystemAddress)


    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    useEffect(() => {
        let ros;
        ros = new ROSLIB.Ros({
            url : ReduxRos
        });
        const receivedTopic = topic

        let viewer = new Viewer({
            divID : 'viewer',
            width: 400,
            height: 400,
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
              max_pts : 50000
          });
    }, []);

    return(
        <div id="viewer"/>
    );
}