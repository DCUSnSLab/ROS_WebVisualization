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
            width: 630,
            height: 450,
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

        // TF가 없는 경우 사용
        const fakeTFClient = {
            subscribe: (frame, cb) => {
                cb({
                    translation: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0, w: 1 }
                });
            },
            unsubscribe: () => {}
        };

        let tfAvailable = false;

        const tfChecker = new ROSLIB.Topic({
            ros: ros,
            name: '/tf',
            messageType: 'tf2_msgs/TFMessage'
        });

        tfChecker.subscribe((msg) => {
            if (msg.transforms.some(t =>
                t.header.frame_id.includes('velodyne') ||
                t.child_frame_id.includes('velodyne')
            )) {
                tfAvailable = true;
            }
        });

        setTimeout(() => {
            const cloudClient = new PointCloud2({
                ros: ros,
                rootObject: viewer.scene,
                tfClient: tfAvailable ? tfClient : fakeTFClient,
                topic: topic,
                material: { color: 0xff00ff, size: 0.05 },
                max_pts: 50000
            });

            tfChecker.unsubscribe();
        }, 2000);

        return () => {
            ros.close();
        };
    }, []);

    return(
        <div id="viewer"/>
    );
}