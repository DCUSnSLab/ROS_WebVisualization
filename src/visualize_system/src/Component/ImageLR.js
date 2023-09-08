import React, {Component, useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

let f_flag = 0;


function ImageLR () {
  const [Limg, setLImg] = useState();

  const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2/zed_node/left/image_rect_color/compressed',
    messageType: 'sensor_msgs/CompressedImage'
  });

  useEffect(() => {
    image_L_topic.subscribe(function(message) {
      if (f_flag < 10){
        // console.log(f_flag);
        f_flag += 1;
      }
      else{
        setLImg("data:image/jpg;base64," + message.data);
        f_flag = 0;
      }
    });
  }, []);

    return(
        <div>
          {/*<h3>right</h3>*/}
          {/*<img src={Rimg}></img>*/}
          <h3>{f_flag}</h3>
          <h3>left</h3>
          <img src={Limg}></img>
        </div>
    );
}

export default ImageLR;
