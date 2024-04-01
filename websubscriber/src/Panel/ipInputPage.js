import './ipInputPage.css';
import React, {useEffect, useState} from 'react';
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import {useROS} from "../ROSContext";
import {addServer} from "../features/IPserver/IpServer";

export default function IpInputPage(){

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [ip1, setIp1] = useState('');
    const [ip2, setIp2] = useState('');
    const [ip3, setIp3] = useState('');
    const [ip4, setIp4] = useState('');


    // 아이피 입력받은거 연결되는지 확인

    const ipConnectionCheck = () => {

        const ip = "ws://" + ip1 + "." + ip2 + "." + ip3  + "." + ip4 + ":9090";

        let ros = new ROSLIB.Ros({
            url : ip
        })
        ros.on('connection', function() {
            document.getElementById("status").innerHTML = "Connected";
            alert("connect!")
            dispatch(addServer(ip))
            navigate("/main")
        });
        ros.on('error', function(error) {
            document.getElementById("status").innerHTML = "Error";
        });

        ros.on('close', function() {
            document.getElementById("status").innerHTML = "Closed";
        });
    }

    return(
        <div className="ip-input-page">
            <h1>Enter IP Address</h1>
            <h5>Connection status: <span id="status"></span></h5>
            <div className="parent-container">
                <input type="url" id="ip1" onChange={e => setIp1(e.target.value)} value={ip1}/>
                <h3>.</h3>
                <input type="url" id="ip2" value={ip2} onChange={e => setIp2(e.target.value)}/>
                <h3>.</h3>
                <input type="url" id="ip3" value={ip3} onChange={e => setIp3(e.target.value)}/>
                <h3>.</h3>
                <input type="url" id="ip4" value={ip4} onChange={e => setIp4(e.target.value)}/>
            </div>
            <div className="button-container">
                <button type="submit" onClick={ipConnectionCheck}>Connect</button>
            </div>
        </div>
    )
}