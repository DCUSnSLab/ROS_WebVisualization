/* global kakao */
import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {MapMarker, Map, Polyline, DrawingManager} from "react-kakao-maps-sdk";
import {Navigate, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


const ros = new ROSLIB.Ros({
url : 'ws://203.250.33.143:9090'
});
function Kakaomap() {

  // const ip = useSelector((state) => state.TopicList.serverIP);
  // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

  const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/ublox/fix",
    messageType: "sensor_msgs/NavSatFix"
  });

    const mapRef = useRef(null);
    const prevLatLngRef = useRef(null);

    const [lat, setLat] = useState();
    const [lng, setLng] = useState();

    useEffect(() => {
        listener.subscribe((message) => {
            setLat(message.latitude);
            setLng(message.longitude);
        })
        prevLatLngRef.current = [lat, lng]
    }, );

    useEffect(() => {
    // console.log( "previous : " + prevLatLngRef.current + "\n" + "current : ");
    }, [lat, lng]);


  return(
        <Map // 지도를 표시할 Container
            center={{
              lat: 35.9138,
              lng: 128.8036
                // lat: lat,
                // lng: lng
                // maker onclickEvt
            }}
            style={{
              // 지도의 크기
            width: "100%",
            height: "100%",
            }}
            level={3} // 지도의 확대 레벨
            ref={mapRef}
          >
            <MapMarker // 마커를 생성합니다
              position={{
                lat: lat,
                lng: lng
              }}
              clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
              draggable={true} // 마커가 드래그 가능하도록 설정합니다
            />
        </Map>
  )
}

export default Kakaomap;