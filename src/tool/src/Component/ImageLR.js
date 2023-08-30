import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import * as ROS3D from 'ros3d';



const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});


function ImageLR () {
  const [Rimg, setRImg] = useState();
  const [Limg, setLImg] = useState();

  const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2/zed_node/left/image_rect_color/compressed',
    messageType: 'sensor_msgs/CompressedImage'
  });

  let f_flag;

  const tfClient = new ROSLIB.TFClient({
    ros : ros,
    fixedFrame: '/velodyne',
  });

  useEffect(() => {
    if (f_flag < 27){
        f_flag += 1;
        console.log(f_flag);
    }
    else if(f_flag === 27) {
      console.log(f_flag);
      image_L_topic.subscribe(function(message) {
        setLImg("data:image/jpg;base64," + message.data);
      });
      f_flag = 0;
    }
  }, []);

  // image_R_topic.subscribe(function(message) {
    //     setRImg("data:image/jpg;base64," + message.data);
    // });
    return(
        <div>
            {/*<h3>right</h3>*/}
            {/*<img src={Rimg}></img>*/}
            <h3>left</h3>
            <img src={Limg}></img>
        </div>
    );
}

export default ImageLR;
