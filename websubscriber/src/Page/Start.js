// 시작페이지
import React, { useState } from "react";
import "./Loginout.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as ROSLIB from "roslib";
import { addServer } from "../features/IPserver/IpServer";

function Start() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ipAddr, setIpAddr] = useState(""); // 입력된 IP 저장
    const [status, setStatus] = useState(" None");

    const ipConnectionCheck = () => {
        if (!ipAddr.trim()) {
            alert("IP 주소를 입력하세요!");
            return;
        }

        // WebSocket URL 생성
        const wsUrl = `ws://${ipAddr.trim()}:9090`;
        console.log("Connecting to:", wsUrl);

        let ros;

        try {
            ros = new ROSLIB.Ros({ url: wsUrl });
        } catch (err) {
            console.error("잘못된 WebSocket URL:", wsUrl, err);
            alert("잘못된 IP 주소 형식입니다!");
            return;
        }

        // 이벤트 바인딩
        ros.on("connection", function () {
            setStatus("Connected");
            dispatch(addServer(wsUrl));
            navigate("/main", {state: {ipAddr}});
        });

        ros.on("error", function (error) {
            console.error("ROS 연결 실패:", error);
            setStatus("Error");
        });

        ros.on("close", function () {
            setStatus("Closed");
        });
    };

    return (
        <div className="background">
            <div className="vertical-box">
                <h1 className="font-title">Snslab Control Monitoring System</h1>

                {/* IP 입력 필드 */}
                <input
                    type="url"
                    className="input"
                    placeholder="IP (예: 192.168.0.10)"
                    style={{ marginTop: "30px" }}
                    value={ipAddr}
                    onChange={(e) => setIpAddr(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && ipConnectionCheck()}
                />
                <div style={{ marginTop: 8, color: "white" }}>Status: {status}</div>
                <button
                    onClick={ipConnectionCheck}
                    className="start-btn"
                    disabled={!ipAddr.trim()}
                    style={{ opacity: ipAddr.trim() ? 1 : 0.6 }}
                >
                    Start
                </button>
            </div>
        </div>
    );
}

export default Start;
