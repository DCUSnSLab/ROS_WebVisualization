/* global kakao */
import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import {MapMarker, Map} from "react-kakao-maps-sdk";
import './first.css';

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

function First() {
  const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/ublox/fix",
    messageType: "sensor_msgs/NavSatFix"
  });

  const [msg, setMsg] = useState();
  const [lat, setLat] = useState();
  const [long, setLong] = useState();

  useEffect(() => {
    listener.subscribe((message) => {
      setMsg('Received message on ' + listener.name + " " + message);
      setLat(message.latitude);
      setLong(message.longitude);
    });
  }, []);

  return(
    <div className="firstContainer">
      <div className="header">
        <h2>First Panel</h2>
        <h3>CPU : 어쩌구</h3>
        <h3>MEMORY : 저쩌구</h3>
      </div>

        {/*<h2>Check MSG</h2>*/}
        {/*<h3>{msg}</h3>*/}
        {/*<h3>( {lat} , {long} )</h3>*/}

      <Map // 지도를 표시할 Container
        center={{
          lat: 35.9138,
          lng: 128.8036
        }}
        style={{
          // 지도의 크기
          height: '65rem',
          width: '100%',
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
    </div>
  )
}

export default First;
