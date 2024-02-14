/* global kakao */
import React, {useEffect, useRef, useState} from 'react';
import * as ROSLIB from 'roslib';
import {MapMarker, Map, Polyline, DrawingManager} from "react-kakao-maps-sdk";
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

  // const [curLatLng, setLatLng] = useState([]);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const prevLatLngRef = useRef(null);

  useEffect(() => {
    listener.subscribe((message) => {
        setLat(message.latitude);
        setLng(message.longitude);
    })
  }, );

  useEffect(() => {
    prevLatLngRef.current = [lat, lng]
    console.log( "previous : " + prevLatLngRef.current + "\n" + "current : ");
  }, [lat, lng]);

  // ref 객체를 통해 kakao.maps.drawng.DrawingManager 객체를 전달 받아 사용합니다.
  const managerRef = useRef(null)

    const [overlayData, setOverlayData] = useState({
    arrow: [],
    circle: [],
    ellipse: [],
    marker: [],
    polygon: [],
    polyline: [],
    rectangle: [],
  })
    function pointsToPath(points) {
        return points.map((point) => ({
          lat: point.y,
          lng: point.x,
        }))
    }


  const navigateToExternalUrl = (url, shouldOpenNewTab) =>
    shouldOpenNewTab ? window.open(url, "_blank") : window.location.href = url;

  return(
        <Map // 지도를 표시할 Container
            center={{
              lat: 35.9138,
              lng: 128.8036
              //   lat: lat,
              //   lng: lng
                // maker onclickEvt
            }}
            style={{
              // 지도의 크기
            width: "100%",
            height: "1000px",
            }}
            level={3} // 지도의 확대 레벨
          >
            <DrawingManager
          ref={managerRef}
          drawingMode={[
            kakao.maps.drawing.OverlayType.ARROW,
            kakao.maps.drawing.OverlayType.CIRCLE,
            kakao.maps.drawing.OverlayType.ELLIPSE,
            kakao.maps.drawing.OverlayType.MARKER,
            kakao.maps.drawing.OverlayType.POLYLINE,
            kakao.maps.drawing.OverlayType.RECTANGLE,
            kakao.maps.drawing.OverlayType.POLYGON,
          ]}
          guideTooltip={["draw", "drag", "edit"]}
          markerOptions={{
            // 마커 옵션입니다
            draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다
            removable: true, // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다
          }}
          polylineOptions={{
            // 선 옵션입니다
            draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
            removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
            editable: true, // 그린 후 수정할 수 있도록 설정합니다
            strokeColor: "#39f", // 선 색
            hintStrokeStyle: "dash", // 그리중 마우스를 따라다니는 보조선의 선 스타일
            hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
          }}
          rectangleOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: "#39f", // 외곽선 색
            fillColor: "#39f", // 채우기 색
            fillOpacity: 0.5, // 채우기색 투명도
          }}
          circleOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: "#39f",
            fillColor: "#39f",
            fillOpacity: 0.5,
          }}
          polygonOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: "#39f",
            fillColor: "#39f",
            fillOpacity: 0.5,
            hintStrokeStyle: "dash",
            hintStrokeOpacity: 0.5,
          }}
          arrowOptions={{
            draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
            removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
            editable: true, // 그린 후 수정할 수 있도록 설정합니다
            strokeColor: "#39f", // 선 색
            hintStrokeStyle: "dash", // 그리중 마우스를 따라다니는 보조선의 선 스타일
            hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
          }}
          ellipseOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: "#39f",
            fillColor: "#39f",
            fillOpacity: 0.5,
          }}
        />
            {overlayData.polyline.map(({ points, options }, i) => (
            <Polyline key={i} path={pointsToPath(points)} {...options} />
          ))}
            <MapMarker // 마커를 생성합니다
              position={{
                lat: lat,
                lng: lng
              }}
              clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
              onClick={() => navigateToExternalUrl("http://127.0.0.1:3000/visualize", true)}
              draggable={true} // 마커가 드래그 가능하도록 설정합니다
            />
        </Map>
  )
}

export default Kakaomap;