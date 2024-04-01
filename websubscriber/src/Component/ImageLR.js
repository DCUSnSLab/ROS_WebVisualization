import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";

function ImageLR ({topic}) {
    let f_flag = 0;
    const [Limg, setLImg] = useState();
    const receivedTopic = topic

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        const image_L_topic = new ROSLIB.Topic({
          ros: ros,
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

        return () => {
            ros.close();
        };
    }, [receivedTopic]);

    return(
        <img src={Limg} style={{width: "400", height: "200"}}></img>
    );
}

export default ImageLR;