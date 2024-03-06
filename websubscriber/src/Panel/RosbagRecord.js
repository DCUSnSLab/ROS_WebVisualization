import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import * as ROSLIB from "roslib";

export default function RosbagRecord(){

    const [logging, setLogging] = useState(false);

    const ros = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
    });

    let addTwoInts = new ROSLIB.Service({
      ros : ros,
      name : '/logging',
      serviceType : 'Logging'
    });

    let requestStart = new ROSLIB.ServiceRequest({
      isLogging : "Start"
    });

    let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "Stop"
    });

    useEffect(() => {
        if(logging === true){
            addTwoInts.callService(requestStart, function(result) {
                console.log(result)
            });
        }
        else if (logging === false){
            addTwoInts.callService(requestStop, function(result) {
                console.log(result)
            });
        }
    }, [logging]);


    // 로깅 버튼 클릭 이벤트 핸들러
    const handleLoggingClick = () => {
        setLogging(!logging);
    };

    return(
        <div>
            <Button onClick={handleLoggingClick}>
                {logging ? 'LOGGING STOP' : 'LOGGING START'}
            </Button>
        </div>
    )
}