import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";

function ImageLR ({topic, ip}) {
    const f_flag = useRef(0);
    const [Limg, setLImg] = useState();
    const receivedTopic = topic

    useEffect(() => {
        if (!ip || !topic) {
            console.log("[ImageLR] waiting for ip/topic", ip, topic);
            return;
        }

        console.log("[ImageLR] connect to", ip);

        const ros = new ROSLIB.Ros({
            url: ip
        });

        const image_L_topic = new ROSLIB.Topic({
          ros: ros,
          name: receivedTopic,
          messageType: 'sensor_msgs/CompressedImage'
        });

        image_L_topic.subscribe(function(message) {
        if (f_flag.current < 5){
          // console.log(f_flag);
          f_flag.current += 1;
        }
        else{
            setLImg("data:image/jpg;base64," + message.data);
              f_flag.current = 0;
            }
        });

        return () => {
            ros.close();
        };
    }, [receivedTopic, ip]);

    return(
        <img style={{width: "100%", height: "100%", objectFit: "contain"}} src={Limg}></img>
    );
}

export default ImageLR;