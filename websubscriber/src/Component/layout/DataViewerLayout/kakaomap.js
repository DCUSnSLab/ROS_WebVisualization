import React from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

const Kakaomap = ({ vehiclesData }) => (
    <Map
        center={{ lat: 35.9138, lng: 128.8036 }}
        style={{ width: "100%", height: "100%" }}
        level={5}
    >
        {Object.entries(vehiclesData || {}).map(([ip, data]) => (
            <React.Fragment key={ip}>
                <MapMarker
                    position={{ lat: data.lat, lng: data.lng }}
                    title={`Vehicle: ${data.name}`}
                />
                {data.waypoints.length > 1 && (
                    <Polyline
                        path={data.waypoints}
                        strokeWeight={3}
                        strokeColor="#FF0000"
                        strokeOpacity={0.8}
                        strokeStyle="solid"
                    />
                )}
            </React.Fragment>
        ))}
    </Map>
);

export default Kakaomap;
