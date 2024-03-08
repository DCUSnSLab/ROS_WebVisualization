import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";


let f_flag = 0;

const ros = new ROSLIB.Ros({
      url : 'ws://203.250.33.143:9090'
});

function ImageLR ({topic, width, height }) {

  const ip = useSelector((state) => state.TopicList.serverIP);
  // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

  const [Limg, setLImg] = useState();

  const receivedTopic = topic

  const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: receivedTopic,
    messageType: 'sensor_msgs/CompressedImage'
  });


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