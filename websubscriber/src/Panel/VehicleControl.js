import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";
import { useWorker, WORKER_STATUS } from "@koale/useworker";
import {updateWebPageStatus} from "../features/PublishedTopics/PublishedTopicSlice";


export default function VehicleControl(){


    let ReduxRos = useSelector((state) => state.ipServer.VisualizeSystemAddress)
    let ros;
    ros = new ROSLIB.Ros({
        url : ReduxRos
    });

    const [control, setControl] = useState(false);

     const cmdVel = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
    });

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

    useEffect(() => {
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
          clearTimeout(timeoutID); // 타임아웃 ID 전달하여 정리
        };

    }, [control]);

    return(
        <>
            <Button variant="success" value={"START"} onClick={() => setControl(true)}>START</Button>
            <Button variant="danger" value={"STOP"} onClick={() => setControl(false)}>STOP</Button>
         </>
    )
}