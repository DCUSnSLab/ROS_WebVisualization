import './ipInputPage.css';
import React, {useEffect, useState} from 'react';
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import {addServer} from "../features/IPserver/IpServer";
export default function IpInputPage(){
    let distach = useDispatch();
    let navigate = useNavigate();
    let ReduxRos = useSelector((state) => state.ipServer.VisualizeSystemAddress)
    let ros;
    ros = new ROSLIB.Ros({
        url : ReduxRos
    });

    const [ip1, setIp1] = useState('');
    const [ip2, setIp2] = useState('');
    const [ip3, setIp3] = useState('');
    const [ip4, setIp4] = useState('');

    console.log(ros)

    // 아이피 입력받은거 연결되는지 확인
    // dispatch로 store에 저장

    const ipConnectionCheck = () => {

        const ip = "ws://" + ip1 + "." + ip2 + "." + ip3  + "." + ip4 + ":9090";

        let ros = new ROSLIB.Ros({
            url : ip
        })
        console.log(ros)

        ros.on('connection', function() {
            document.getElementById("status").innerHTML = "Connected";
            distach(addServer(ip))
            alert("connect!")
            navigate("/main")
        });
        ros.on('error', function(error) {
            document.getElementById("status").innerHTML = "Error";
        });

        ros.on('close', function() {
            document.getElementById("status").innerHTML = "Closed";
        });
    }

    useEffect(() => {

    }, []);

    return(
        <>
            <p>Connection status: <span id="status"></span></p>
            <h1>IP Input</h1>
            <div className="parent-container">
                <input type="url" id="ip1" onChange={e => setIp1(e.target.value)} value={ip1}/>
                <label className="middle">.</label>
                <input type="url" id="ip2" value={ip2} onChange={e => setIp2(e.target.value)}/>
                <label className="middle">.</label>
                <input type="url" id="ip3" value={ip3} onChange={e => setIp3(e.target.value)}/>
                <label className="middle">.</label>
                <input type="url" id="ip4" value={ip4} onChange={e => setIp4(e.target.value)}/>
            </div>
            <div>
                {ip1}.{ip2}.{ip3}.{ip4}
            </div>
            <button type="submit" onClick={ipConnectionCheck}>Connect!</button>
        </>
    )
}