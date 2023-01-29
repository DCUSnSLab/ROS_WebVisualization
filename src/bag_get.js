import React, {useEffect, useState} from "react";
import ROSLIB from "roslib";

// 230129 16:39 랩짱의 팩폭 고발 너무 무섭습니다 ㅜㅜ
// 보은 : 이슈발생. client가 계속 rosbridge 서버 connect된다. 최대 254까지. 문제가 되나요?
// 준홍 : 당연히 문제가 되지!!!(버럭)

// ros가 업데이트 될 때 마다
// ros 데이터 구독을 위한 웹소켓 인스턴스를 계속 생성하는 것 같다.


// 1. addr 객체, ros 객체를 Bag_get 밖으로 빼네니까 클라이언트로 다시 접속 안 하고 계속 unsub랑 sub만 반복
const addr = "ws://localhost:9090"
let ros = new ROSLIB.Ros({
    url : addr
})

let listener = new ROSLIB.Topic({
    ros: ros,
    name: "/gps_data",
    messageType: "sensor_msgs/NavSatFix"
});

function Bag_get(){
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

    listener.subscribe((message) => {
        // to do message
        setMsg('Received message on ' + listener.name + message);
        setLat(message.latitude);
        setLong(message.longitude);
    });

    return(
        <div style={{textAlign : 'center'}}>
            <h1>Check MSG</h1>
            <h2>{msg}</h2>
            <h2>( {lat} , {long} )</h2>
        </div>
    );
}
export default Bag_get;