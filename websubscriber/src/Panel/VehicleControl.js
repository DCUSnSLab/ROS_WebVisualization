import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import * as ROSLIB from "roslib";
import {useSelector} from "react-redux";

const ros = new ROSLIB.Ros({
    url : 'ws://203.250.33.143:9090'
});

export default function VehicleControl(){

    const [control, setControl] = useState(false);

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

     var cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
    });

    var startTwist = new ROSLIB.Message({
        linear : {
          x : 0.5,
          y : 0.0,
          z : 0.0
        },
        angular : {
          x : 0.0,
          y : 0.0,
          z : 0.0
        }
    });
    var stopTwist = new ROSLIB.Message({
        linear : {
          x : 0.0,
          y : 0.0,
          z : 0.0
        },
        angular : {
          x : 0.0,
          y : 0.0,
          z : 0.0
        }
    });

    useEffect(() => {
    let timeoutID; // 타임아웃 ID 변수 추가

    const publishMessage = () => {
          if (control) {
            cmdVel.publish(startTwist);
            timeoutID = setTimeout(publishMessage); // 시간 간격 전달
          } else {
            cmdVel.publish(stopTwist);
          }
    };

    publishMessage();

    return () => {
      clearTimeout(timeoutID); // 타임아웃 ID 전달하여 정리
    };
  }, [control]);



    return(
        <>
            {/*<Button variant="success" value={"START"} onClick={() => setControl(true)}>START</Button>*/}
            {/* <Button variant="danger" value={"STOP"} onClick={() => setControl(false)}>STOP</Button>*/}
            <Button variant="success" value={"START"} onClick={() => setControl(true)}>START</Button>
             <Button variant="danger" value={"STOP"} onClick={() => setControl(false)}>STOP</Button>
         </>
    )
}