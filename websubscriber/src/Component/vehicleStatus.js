import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import {CDBContainer, CDBProgress} from "cdbreact";
import {useDispatch, useSelector} from "react-redux";


// ros를 VehicleStatus 안에 넣으면 client 수가 최소 252명까지 증가. 이유불명
const ros = new ROSLIB.Ros({
    url : 'ws://203.250.33.143:9090'
});

const VehicleStatus = () => {

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
        <div style={{position: "block", display: "grid", gridTemplateColumns: "70px 70px 70px"}}>
            <div style={{margin: "10px"}}>
                <h5 style={{textAlign: "center"}}>CPU</h5>
                <CDBProgress
                    value={cpu}
                    text={`${cpu}%`}
                    colors="danger"
                    height={5}
                    width={5}
                />
            </div>
            <div style={{margin: "10px"}}>
                <h5 style={{textAlign: "center"}}>GPU</h5>
                <CDBProgress
                    value={gpu}
                    text={`${gpu}%`}
                    colors="info"
                    height={5}
                    width={5}
                />
            </div>
            <div style={{margin: "10px"}}>
                <h5 style={{textAlign: "center"}}>RAM</h5>
                <CDBProgress
                    value={ram}
                    text={`${ram}%`}
                    colors="success"
                    height={5}
                    width={5}
                />
            </div>
       </div>
    );
}

export default VehicleStatus;