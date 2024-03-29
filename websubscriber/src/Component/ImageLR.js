import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";

function ImageLR ({topic}) {
    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);
    let f_flag = 0;
    const [Limg, setLImg] = useState();
    const receivedTopic = topic

    useEffect(() => {

        const ros_const = new ROSLIB.Ros({
            url: ip
        });

        const image_L_topic = new ROSLIB.Topic({
          ros: ros_const,
          name: receivedTopic,
          messageType: 'sensor_msgs/CompressedImage'
        });

        console.log("ImageLR")
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