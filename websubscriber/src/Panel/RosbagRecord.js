import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";
import {updateWebPageStatus} from "../features/PublishedTopics/PublishedTopicSlice";
import {useROS} from "../ROSContext";

export default function RosbagRecord(){
    const [logging, setLogging] = useState(false);

    let requestStart = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStart"
    });

    let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStop"
    });

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        let LoggingRequest = new ROSLIB.Service({
          ros : ros,
          name : '/logging',
          serviceType : 'Logging'
        });

        // logging 하는중
        if(logging === true){
            LoggingRequest.callService(requestStart, function(result) {
                console.log(result)
            });
        }
        else{
            LoggingRequest.callService(requestStop, function(result) {
                console.log(result)
            });
        }
        return () => {
            ros.close();
        };
    }, [logging]);


    // 로깅 버튼 클릭 이벤트 핸들러
    const handleLoggingClick = () => {
        setLogging(!logging);
    };

    return(
        <Button variant="warning" style={{color: "white"}} onClick={handleLoggingClick}>
            {logging ? 'LOGGING STOP' : 'LOGGING START'}
        </Button>
    )
}