import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import {CDBContainer, CDBProgress} from "cdbreact";
import {useDispatch, useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";
import {useROS} from "../ROSContext";

const VehicleStatus = () => {
    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    const [cpu, setCPU] = useState([]);
    const [ram, setRAM] = useState([]);
    const [gpu, setGPU] = useState([]);
    const [vehicleIP, setVehicleIP] = useState([]);

    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });
        
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
        return () => {
            ros.close();
        };
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