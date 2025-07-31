import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";

export default function VehicleControl(){

    const [control, setControl] = useState(false);

    let startTwist = new ROSLIB.Message({
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
    let stopTwist = new ROSLIB.Message({
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

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

         const cmdVel = new ROSLIB.Topic({
            ros : ros,
            name : '/cmd_vel',
            messageType : 'geometry_msgs/Twist'
        });

        let timeoutID;
        const publishMessage = () => {
            if (control) {
                cmdVel.publish(startTwist);
                timeoutID = setTimeout(publishMessage, 1); // 시간 간격 전달
            }
            else {
                cmdVel.publish(stopTwist);
            }
        };

        publishMessage();

        return () => {
            clearTimeout(timeoutID); // 타임아웃 ID 전달하여 정리\
            ros.close();
        };

    }, [control]);

    return(
        <>
            <Button variant="success" value={"START"} onClick={() => setControl(true)}>START</Button>
            <Button variant="danger" value={"STOP"} onClick={() => setControl(false)}>STOP</Button>
         </>
    )
}