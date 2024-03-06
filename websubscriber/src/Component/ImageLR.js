import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

let f_flag = 0;

function ImageLR ({topic, width, height }) {

  const [Limg, setLImg] = useState();

  const receivedTopic = topic

  const image_L_topic = new ROSLIB.Topic({
    ros: ros,
    name: receivedTopic,
    messageType: 'sensor_msgs/CompressedImage'
  });

    const [receivedH, setH]= useState(300)
    const [receivedW, setW]= useState(300)

  useEffect(() => {
    setH(height)
    setW(width)
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
        <div>
            <img src={Limg} style={{width: receivedW, height: receivedH}}></img>
        </div>
    );
}

export default ImageLR;