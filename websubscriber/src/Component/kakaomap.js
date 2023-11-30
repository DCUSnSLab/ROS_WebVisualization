/* global kakao */
import React, {useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';
import {MapMarker, Map} from "react-kakao-maps-sdk";
import {Navigate, useNavigate} from "react-router-dom";

const ros = new ROSLIB.Ros({
  url : 'ws://localhost:9090'
});

function Kakaomap() {

  const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/ublox/fix",
    messageType: "sensor_msgs/NavSatFix"
  });

  const [lat, setLat] = useState();
  const [long, setLong] = useState();

  useEffect(() => {
    listener.subscribe((message) => {
      setLat(message.latitude);
      setLong(message.longitude);
    });
  }, []);

  const navigate = useNavigate();

  const navigateToExternalUrl = (url, shouldOpenNewTab) =>
    shouldOpenNewTab ? window.open(url, "_blank") : window.location.href = url;

  return(
    <Map // 지도를 표시할 Container
        center={{
          lat: 35.9138,
          lng: 128.8036
        }}
        style={{
          // 지도의 크기
          height: '50rem',
          width: '80%',
        }}
        level={3} // 지도의 확대 레벨
      >
        <MapMarker // 마커를 생성합니다
          position={{
            lat: lat,
            lng: long
          }}
          clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
          onClick={() => navigateToExternalUrl("http://localhost:3000/visualize", true)}
          draggable={true} // 마커가 드래그 가능하도록 설정합니다
        >
        </MapMarker>
    </Map>
  )
}

export default Kakaomap;