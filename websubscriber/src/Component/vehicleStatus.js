import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import {CDBContainer, CDBProgress} from "cdbreact";

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
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

const ipClient = new ROSLIB.Topic({
    ros : ros,
    name : '/pubScvIP',
    messageType : 'std_msgs/String'
})


const VehicleStatus = () => {

    const [cpu, setCPU] = useState([]);
    const [ram, setRAM] = useState([]);
    const [gpu, setGPU] = useState([]);
    const [ip, setIP] = useState([]);

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
        ipClient.subscribe((msg)=> {
            setIP(msg.data)
        })
    }, []);

    return(
        <CDBContainer>
            <h5 style={{textAlign: "center", margin: "10px"}}>CPU</h5>
            <CDBProgress
                value={cpu}
                text={`${cpu}%`}
                colors="danger"
                height={5}
                width={5}
            />
            <h5 style={{textAlign: "center", margin: "10px"}}>GPU</h5>
            <CDBProgress
                value={gpu}
                text={`${gpu}%`}
                colors="info"
                height={5}
                width={5}
            />
            <h5 style={{textAlign: "center", margin: "10px"}}>RAM</h5>
            <CDBProgress
                value={ram}
                text={`${ram}%`}
                colors="success"
                height={5}
                width={5}
            />
          {/*<CDBProgress*/}
          {/*  value={40}*/}
          {/*  text={`${40}%`}*/}
          {/*  colors="danger"*/}
          {/*/>*/}
          {/*<CDBProgress*/}
          {/*  value={90}*/}
          {/*  text={`${90}%`}*/}
          {/*  colors="info"*/}
          {/*/>*/}
          {/*<CDBProgress*/}
          {/*  value={60}*/}
          {/*  text={`${60}%`}*/}
          {/*  colors="warning"*/}
          {/*/>*/}
        </CDBContainer>
    );
}

export default VehicleStatus;