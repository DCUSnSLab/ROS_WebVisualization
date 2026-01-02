import React, { useEffect, useRef } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

const Kakaomap = ({ vehiclesData, leftPanelWidth }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            map.relayout();
            const center = map.getCenter();
            map.setCenter(center);
        }
    }, [leftPanelWidth]);

    return (
        <div
            style={{ width: "100%", height: "100%" }}
        >
            <Map
                center={{ lat: 35.9138, lng: 128.8036 }}
                level={5}
                style={{ width: "100%", height: "100%" }}
                onCreate={(map) => {
                    mapRef.current = map;
                }}
            >
                {Object.entries(vehiclesData || {}).map(([ip, data]) => (
                    <React.Fragment key={ip}>
                        <MapMarker
                            position={{ lat: data.lat, lng: data.lng }}
                            title={`Vehicle: ${data.name}`}
                        />
                        {data.waypoints?.length > 1 && (
                            <Polyline
                                path={data.waypoints}
                                strokeWeight={3}
                                strokeColor="#FF0000"
                                strokeOpacity={0.8}
                            />
                        )}
                    </React.Fragment>
                ))}
            </Map>
        </div>
    );
};

export default Kakaomap;
