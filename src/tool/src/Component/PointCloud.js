import React, {Component, useEffect, useState} from 'react';
import {Viewer, Grid, PointCloud2, UrdfClient} from 'ros3d';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

function Simula(){
  useEffect(() => {

  const viewer = new Viewer({
    divID : 'viewer',
    width: 1000,
    height: 400,
    antialias : true,
    background : '#111111',
  });

  viewer.addObject(new ROS3D.Grid());

  const tfClient = new ROSLIB.TFClient({
    ros : ros,
    angularThres : 0.1,
    transThres : 0.1,
    rate : 10.0,
    fixedFrame: '/velodyne',
  });

  const cloudClient = new PointCloud2({
      ros : ros,
      rootObject : viewer.scene,
      tfClient : tfClient,
      pointRatio: 10,
      topic : '/velodyne_points',
      material : {color: 0xff00ff, size: 0.001},
      max_pts : 30000
    });

  }, []);

  return(
    <>
      <h2>velodyne_points</h2>
      <div id="viewer"></div>
    </>
  );
}

export default Simula;
