import React, { useEffect, useRef } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { useDispatch } from 'react-redux';
import { showInfoBox, hideInfoBox } from "../../../features/infobox/infoBoxSlice";

const Kakaomap = ({ vehiclesData, leftPanelWidth }) => {
    const mapRef = useRef(null);
    const markerClickedRef = useRef(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            map.relayout();
            const center = map.getCenter();
            map.setCenter(center);
        }
    }, [leftPanelWidth]);

    const handleMarkerClick = (marker, vehicle, ip) => {
        markerClickedRef.current = true;

        const map = mapRef.current;
        if (!map) return;

        const projection = map.getProjection();
        const point = projection.pointFromCoords(marker.getPosition());

        dispatch(showInfoBox({
            x: point.x,
            y: point.y,
            vehicle: { ...vehicle, ip },
        }));
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Map
                center={{ lat: 35.9138, lng: 128.8036 }}
                level={5}
                style={{ width: "100%", height: "100%" }}
                onCreate={(map) => {
                    mapRef.current = map;
                }}
            >
                {Object.entries(vehiclesData || {}).map(([ip, data]) => {
                    const lat = data.lat;
                    const lng = data.lng;

                    return (
                        <React.Fragment key={ip}>
                            <MapMarker
                                position={{ lat, lng }}
                                title={`Vehicle: ${data.name}`}
                                onClick={(marker) =>
                                    handleMarkerClick(marker, data, ip)
                                }
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
                    );
                })}
            </Map>
        </div>
    );
};

export default Kakaomap;
