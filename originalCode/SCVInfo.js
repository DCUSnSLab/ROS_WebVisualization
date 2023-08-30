import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const htClient = new ROSLIB.Topic({
    ros : ros,
    name : '/hunter_status',
    messageType : 'hunter_msgs/HunterStatus'
})

const SCVInfo = () => {

    const vehicle_state = ["base_state", "battery_voltage", "control_mode",
        "driver_states", "fault_code", "header",
        "linear_velocity", "motor_states", "park_mode", "steering_angle"]

    const [value, setValue] = useState([]);

    useEffect(() => {
        htClient.subscribe((msg) => {
        console.log(Object.keys(msg))
        console.log(Object.values(msg))
        setValue(Object.values(msg));
        })
    }, [value]);

    const keymap = vehicle_state.map( key =>
        <h3 key={[key]}>{key} : {[value]}</h3>
    )

    return(
        <div>
            <div>{keymap}</div>
        </div>
    );
}
export default SCVInfo;