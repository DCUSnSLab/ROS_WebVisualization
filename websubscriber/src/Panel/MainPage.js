import './MainPage.css';
import React, {useEffect, useState} from "react";
import * as ROSLIB from "roslib";
import LeftSideBar from "./LeftSideBar";
import Kakaomap from "../Component/kakaomap";

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

function MainPage(){

    ros.on('error', function (error) {
        console.log(error);
        return(
            <p>error</p>
        )
        // document.getElementById('header').style.backgroundColor = "#f03737";
    });
    ros.on('connection', function () {
        console.log('Connection made!');
        // document.getElementById('header').style.backgroundColor = "#07a666";
        return(
            <p>Connection</p>
        )
    })
    ros.on('close', function () {
        console.log('Connection closed.');
        // document.getElementById('header').style.backgroundColor = "#a0a0a0";
        return(
            <p>Connection closed.</p>
        )
    });

    const listener = new ROSLIB.Topic({
        ros: ros,
        name: "/scvVehiclePub",
        messageType: "std_msgs/String"
    });

    const [scvVehicle, setScvVehicle] = useState();

    useEffect(() => {
        listener.subscribe((message) => {
            console.log(message)
            setScvVehicle(message.data)
        });
    }, []);

    return(
    <div id="container">
        <LeftSideBar/>
        <Kakaomap id="kakao"/>
    </div>
    );
}

export default MainPage;