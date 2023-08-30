import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';
import {Viewer} from 'ros3d';

const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});

export default function MarkerTest(){

  useEffect(() => {

    const viewer = new ROS3D.Viewer({
      divID: 'markers',
      width: 800,
      height: 600,
      antialias: true,
      alpha: 0.5
    });

    viewer.addObject(new ROS3D.Grid());

    const tfClient = new ROSLIB.TFClient({
      ros : ros,
      angularThres : 0.01,
      transThres : 0.01,
      rate : 10.0,
      fixedFrame : '/zed2_left_camera_frame'
    });

    const markerClient = new ROS3D.MarkerClient({
      ros : ros,
      tfClient : tfClient,
      topic : '/visualization_marker',
      rootObject : viewer.scene
    });

  });

  return(
    <div id="markers">
    </div>
  )
}
