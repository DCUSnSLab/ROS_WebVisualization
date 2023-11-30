import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const htClient = new ROSLIB.Topic({
    ros : ros,
    name : '/scvStatusPub',
    messageType : 'std_msgs/Float32MultiArray'
})

const cpuClient = new ROSLIB.Topic({
    ros : ros,
    name : '/cpuPub',
    messageType : 'std_msgs/Float64'
})
const ramClient = new ROSLIB.Topic({
    ros : ros,
    name : '/ramPub',
    messageType : 'std_msgs/Float64'
})
const gpuClient = new ROSLIB.Topic({
    ros : ros,
    name : '/gpuPub',
    messageType : 'std_msgs/Float64'
})

const ipClient = new ROSLIB.Topic({
    ros : ros,
    name : '/scvIPPub',
    messageType : 'std_msgs/String'
})
const VehicleStatus = () => {

    const vehicle_state = ["base_state", "battery_voltage", "control_mode",
        "driver_states", "fault_code", "header",
        "linear_velocity", "motor_states", "park_mode", "steering_angle"]

    const vehicle_state_custom = ["control_mode", "base_state", "park_mode",
        "battery_voltage", "linear_velocity", "steering_angle"]

    const [hs, setHS] = useState([]);
    const [cpu, setCPU] = useState([]);
    const [ram, setRAM] = useState([]);
    const [gpu, setGPU] = useState([]);
    const [ip, setIP] = useState([]);

    useEffect(() => {
        htClient.subscribe((msg) => {
            setHS(msg.data)
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
        ipClient.subscribe((msg)=> {
            setIP(msg.data)
        })
        htClient.subscribe((data) => {
            setHS(data.data)
        })
    }, []);

    const stateFloatArr = hs.map((data, num) =>
        <h2> {vehicle_state_custom[num]} : {data} </h2> )

    return(
        <div>
            {stateFloatArr}
            <h2>CPU : {cpu}%</h2>
            <h2>RAM : {ram}%</h2>
            <h2>GPU : {gpu}%</h2>
            <h2>IP : {ip}</h2>

        </div>
    );
}
export default VehicleStatus;