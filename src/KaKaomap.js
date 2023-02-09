/* global kakao */
import React, {useEffect, useState, useRef} from 'react';
import * as ROSLIB from 'roslib';
import {MapMarker, Map} from "react-kakao-maps-sdk";
import * as ROS3D from 'ros3d';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/converted_gps_data",
    messageType: "sensor_msgs/NavSatFix"
});

const Kakaomap = () => {
    const [msg, setMsg] = useState();
    const [con, setCon] = useState();
    const [lat, setLat] = useState();
    const [long, setLong] = useState();

    ros.on("connection", () => {
        setCon("Connected to websocket server.");
    });
    ros.on("error", () => {
        const error = "Error connecting to websocket server.";
        setCon(error);
    });
    ros.on("close", () => {
        setCon("Connection to websocket server closed.");
    });

    useEffect(() => {
        listener.subscribe((message) => {
            setMsg('Received message on ' + listener.name + " " + message);
            setLat(message.latitude);
            setLong(message.longitude);
        });
    }, []);

    return (
    <div className="container">
        <h3>{con}</h3>
        <h2>Check MSG</h2>
        <h3>{msg}</h3>
        <h3>( {lat} , {long} )</h3>
        {lat && long &&
            <Map // 지도를 표시할 Container
                center={{
                    lat: 35.9138,
                    lng: 128.8036
                }}
                style={{
                    // 지도의 크기
                    width: "600px",
                    height: "450px",
                }}
                level={3} // 지도의 확대 레벨
            >
            <MapMarker // 마커를 생성합니다
                position={{
                    lat: lat,
                    lng: long
                }}
                draggable={true} // 마커가 드래그 가능하도록 설정합니다
            />
            </Map>
        }
    </div>
    );
}

export default Kakaomap;