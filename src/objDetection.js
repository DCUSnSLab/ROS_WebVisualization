import { createRoot } from 'react-dom/client'
import React, {useEffect, useRef, useState} from 'react'
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

// image subscriber
const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2/zed_node/left/image_rect_color/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});

// object subscriber
const objectSub = new ROSLIB.Topic({
    ros : ros,
    name : '/zed2/zed_node/obj_det/objects',
    messageType: 'zed_interfaces/ObjectsStamped'
})

const ObjDetection = () => {
    const [Limg, setLImg] = useState();

    const viewer = new ROS3D.Viewer({
        divID: 'viewer',
        width: 400,
        height: 300,
        antialias: true
    });

    const tfClient = new ROSLIB.TFClient({
        ros: ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 10.0,
        // fixedFrame : '/zed2_left_camera_optical_frame'
    });

    const cube = new ROS3D.MeshResource({
        ros: ros,
        tfClient: tfClient,
        // topic : '/zed2/zed_node/left/image_rect_color/compressed',
        rootObject : viewer.scene
    })

    const urdfClient = new ROS3D.UrdfClient({
        ros : ros,
        tfClient : tfClient,
        path : 'http://resources.robotwebtools.org/',
        rootObject : viewer.scene
    });

    image_L_topic.subscribe(function(message) {
        setLImg("data:image/jpg;base64," + message.data);
    });


    return(
      <div>
          <h3>left</h3>
          <img src={Limg}></img>
      </div>
    );
}