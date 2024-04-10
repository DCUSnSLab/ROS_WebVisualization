import React, {useEffect, useState} from 'react';
import {Viewer, Grid, PointCloud2} from 'ros3d';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";

export default function PCL({topic}){

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅
    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);


    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        let viewer = new Viewer({
            divID : 'viewer',
            width: 430,
            height: 250,
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
              topic : topic,
              material : {color: 0xff00ff, size: 0.05},
              max_pts : 50000
          });

        return () => {
            ros.close();
        };
    }, []);

    return(
        <div id="viewer"/>
    );
}