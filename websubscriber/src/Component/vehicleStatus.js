import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import {CDBContainer, CDBProgress} from "cdbreact";
import {useDispatch, useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";



const VehicleStatus = () => {


    let ReduxRos = useSelector((state) => state.ipServer.VisualizeSystemAddress)
    let ros;
    ros = new ROSLIB.Ros({
        url : ReduxRos
    });

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅
    const dispatch = useDispatch()

    const cpuClient = new ROSLIB.Topic({
        ros : ros,
        name : '/pubCpu',
        messageType : 'std_msgs/Float64'
    })
    const ramClient = new ROSLIB.Topic({
        ros : ros,
        name : '/pubRam',
        messageType : 'std_msgs/Float64'
    })
    const gpuClient = new ROSLIB.Topic({
        ros : ros,
        name : '/pubGpu',
        messageType : 'std_msgs/Float64'
    })

    // const ipClient = new ROSLIB.Topic({
    //     ros : ros,
    //     name : '/pubScvIP',
    //     messageType : 'std_msgs/String'
    // })

    const [cpu, setCPU] = useState([]);
    const [ram, setRAM] = useState([]);
    const [gpu, setGPU] = useState([]);
    const [vehicleIP, setVehicleIP] = useState([]);

    useEffect(() => {
        cpuClient.subscribe((msg)=> {
            setCPU(msg.data)
        })
        ramClient.subscribe((msg)=> {
            setRAM(msg.data)
        })
        gpuClient.subscribe((msg)=> {
            setGPU(msg.data)
        })
        // ipClient.subscribe((msg)=> {
        //     setVehicleIP(msg.data)
        // })
    }, []);

    return(
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
            <div style={{textAlign: "center", margin: "10px"}}>
                <h5>CPU</h5>
                <CDBProgress
                    value={cpu}
                    text={`${cpu}%`}
                    colors="danger"
                    height={5}
                    width={7}
                />
            </div>
            <div style={{textAlign: "center", margin: "10px"}}>
                <h5>GPU</h5>
                <CDBProgress
                    value={gpu}
                    text={`${gpu}%`}
                    colors="info"
                    height={5}
                    width={7}
                />
            </div>
            <div style={{textAlign: "center", margin: "10px"}}>
                <h5>RAM</h5>
                <CDBProgress
                    value={ram}
                    text={`${ram}%`}
                    colors="success"
                    height={5}
                    width={7}
                />
            </div>
       </div>
    );
}

export default VehicleStatus;