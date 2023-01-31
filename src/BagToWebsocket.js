/*global kakao*/
import React, {useEffect, dismaker, useState, useRef} from "react";
import ROSLIB from "roslib";
import {Map, MapMarker} from "react-kakao-maps-sdk";


// 1. addr 객체, ros 객체를 BagToWebsocket 밖으로 빼네니까 클라이언트로 다시 접속 안 하고 계속 unsub랑 sub만 반복

const ros = new ROSLIB.Ros({
    url : "ws://localhost:9090"
})

const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/gps_data",
    messageType: "sensor_msgs/NavSatFix"
});

function BagToWebsocket(){
    const [msg, setMsg] = useState('');
    const [lat, setLat] = useState();
    const [long, setLong] = useState();

    ros.on("connection", () => {
        setMsg("Connected to websocket server.");
    });
    ros.on("error", () => {
        const error = "Error connecting to websocket server.";
        setMsg(error);
    });
    ros.on("close", () => {
        setMsg("Connection to websocket server closed.");
    });

    return(
        <div style={{textAlign : 'center'}}>
            <h1>Check MSG</h1>
            <h2>{msg}</h2>
            <h2>( {lat} , {long} )</h2>
            <div id="map" style={{width: '100%', height: '430px'}}/>
        </div>
    );
}

export default BagToWebsocket;