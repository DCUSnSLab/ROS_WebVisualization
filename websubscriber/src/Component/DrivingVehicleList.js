import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {object} from "prop-types";
import {useSelector} from "react-redux";
import GaugeChart from 'react-gauge-chart'

const ros = new ROSLIB.Ros({
    url : 'ws://203.250.33.143:9090'
});

export default function DrivingVehicleList(){

    // const ip = useSelector((state) => state.TopicList.serverIP);
     // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    const HunterStatus = new ROSLIB.Topic({
      ros: ros,
      name: '/hunter_status',
      messageType: 'hunter_msgs/HunterStatus'
    });

    const [vehicle, setVehicle] = useState({
        current: '',
        rpm: '',
        temperature: '',
        motor_pose: ''
    });

    const [front_motor, setFront_motor] = useState([]);
    const [left_motor, setLeft_motor] = useState([]);
    const [right_motor, setRight_motor] = useState([]);
    const [batteryPercent, setBatteryPercent] = useState([]);
    const [mToKmVelocity, setMToKmVelocity] = useState([]);
    const [steeringToRadian, setSteeringToRadian] = useState([]);

    useEffect(() => {
        HunterStatus.subscribe((data) => {
            console.log(data)
            let vehicle = Object.values(data)

            // setFront_motor(v[8][0])

            // setLeft_motor({
            // current: vehicle.motor_states[1].current,
            // rpm: vehicle.motor_states[1].rpm,
            // temperature: vehicle.motor_states[1].temperature,
            // motor_pose: vehicle.motor_states[1].motor_pose
            // })
            //
            // setRight_motor({
            // current: vehicle.motor_states[2].current,
            // rpm: vehicle.motor_states[2].rpm,
            // temperature: vehicle.motor_states[2].temperature,
            // motor_pose: vehicle.motor_states[2].motor_pose
            // })

            // battery voltage
            setBatteryPercent(vehicle.battery_voltage / 27.9 * 100)


            // max linear velocity : 1.5 m/s ( 5.4km/h )
            // 속도 -> 게이지바
            setMToKmVelocity((vehicle.linear_velocity * 3.6).toFixed(4))

            // steering angle + : 왼쪽, - : 오른쪽
            // 최대 각도 - ~ + 찾아보기 -> 헌터스팩 2.0 찾아보기
            setSteeringToRadian((vehicle.steering_angle * (180 / Math.PI)).toFixed(2))
            // console.log(front_motor, left_motor, right_motor, batteryPercent, mToKmVelocity, steeringToRadian)

        })

        const timer = setTimeout(() => {
            setCurrentPercent(batteryPercent);
            setArcs([0.1, 0.3, 0.6])
            console.log(batteryPercent)
        },5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const [currentPercent, setCurrentPercent] = useState();
    const [arcs, setArcs] = useState([0.5, 0.3, 0.2])

    const chartStyle = {
        height: 250,
        width: 250
	}

    return(
        <div>
            {/*<p>front_motor : {front_motor.current}, {front_motor.rpm}, {front_motor.temperature}, {front_motor.motor_pose}</p>*/}
            {/*<p>left_motor : {left_motor.current}, {left_motor.rpm}, {left_motor.temperature}, {left_motor.motor_pose}</p>*/}
            {/*<p>right_motor : {right_motor.current}, {right_motor.rpm}, {right_motor.temperature}, {right_motor.motor_pose}</p>*/}

            {/*<p>batteryPercent : {batteryPercent}</p>*/}
            {/*<p>mToKmVelocity : {mToKmVelocity}</p>*/}
            {/*<p>steeringToRadian : {steeringToRadian}</p>*/}
            <div id="app" style={{ height: "30vh", display: "flex", width: "20vw"}}>
                <GaugeChart
                    id="gauge-chart7"
                    style={chartStyle}
                    percent={currentPercent}
                    animDelay={0}
                />
            </div>
        </div>
    );

}