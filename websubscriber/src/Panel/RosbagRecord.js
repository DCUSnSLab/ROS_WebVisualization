import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";
import {updateWebPageStatus} from "../features/PublishedTopics/PublishedTopicSlice";

export default function RosbagRecord(){
    const [logging, setLogging] = useState(false);

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅


    let ReduxRos = useSelector((state) => state.ipServer.VisualizeSystemAddress)
    let ros;
    ros = new ROSLIB.Ros({
        url : ReduxRos
    });

    let LoggingRequest = new ROSLIB.Service({
      ros : ros,
      name : '/logging',
      serviceType : 'Logging'
    });

    let requestStart = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStart"
    });

    let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStop"
    });


    useEffect(() => {
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