import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";


function ImageLR ({topic, width, height }) {


    let ReduxRos = useSelector((state) => state.ipServer.VisualizeSystemAddress)
    let ros;
    ros = new ROSLIB.Ros({
        url : ReduxRos
    });

  // const webvizNodeAddress = useSelector((state) => state.VisualizeSystemAddress);
  // console.log(webvizNodeAddress)
  // const rosClient = new ROSLIB.Ros({
  //   url: webvizNodeAddress
  // });
  const [Limg, setLImg] = useState();

  const receivedTopic = topic

  const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: receivedTopic,
    messageType: 'sensor_msgs/CompressedImage'
  });

  let f_flag = 0;
  useEffect(() => {
    image_L_topic.subscribe(function(message) {
      if (f_flag < 5){
        // console.log(f_flag);
        f_flag += 1;
      }
      else{
        setLImg("data:image/jpg;base64," + message.data);
        f_flag = 0;
      }
    });
  }, [receivedTopic]);

    return(
        <img src={Limg} style={{width: "400", height: "200"}}></img>
    );
}

export default ImageLR;