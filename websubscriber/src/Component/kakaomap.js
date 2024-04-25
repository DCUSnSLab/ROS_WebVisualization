/* global kakao */
import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {MapMarker, Map, Polyline, DrawingManager} from "react-kakao-maps-sdk";
import {useDispatch, useSelector} from "react-redux";
import {updatedTopic} from "../features/PublishedTopics/PublishedTopicSlice";

function Kakaomap() {

    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [gpsTopic, setGpsTopic] = useState();

    const [waypoints, setWaypoints] = useState([]); // Add a state to store the waypoints

    const topicList = useSelector((state) => state.TopicList.topics.topic);

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    // type이 sensor_msgs/NavSatFix 토픽 구독

    const navSatFixTopic = topicList.find(topic => topic.type === 'sensor_msgs/NavSatFix');

    useEffect(() => {
        const ros = new ROSLIB.Ros({
            url: ip
        });

        const listener = new ROSLIB.Topic({
            ros: ros,
            // name: "/ublox_gps/fix",
            name: "/ublox/fix",
            messageType: "sensor_msgs/NavSatFix"
        });

        listener.subscribe((message) => {
            setLat(message.latitude);
            setLng(message.longitude);
            setWaypoints((oldWaypoints) => [...oldWaypoints, { lat: message.latitude, lng: message.longitude }]);
        })

        return () => {
            ros.close();
        };
    }, []);

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
                width: "50vw",
                height: "100vh",
            }}
            level={3} // 지도의 확대 레벨
          >
            <MapMarker // 마커를 생성합니다
                position={{
                    lat: lat,
                    lng: lng
                }}
                clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
                draggable={true} // 마커가 드래그 가능하도록 설정합니다
            />
            <Polyline // Draw polyline connecting waypoints
                path={waypoints}
                strokeWeight={3} // set the strokeWeight
                strokeColor={'#FF0000'} // set the strokeColor
                strokeOpacity={0.8} // set the strokeOpacity
                trokeStyle={'solid'} // set the strokeStyle
            />
        </Map>
  )
}

export default Kakaomap;