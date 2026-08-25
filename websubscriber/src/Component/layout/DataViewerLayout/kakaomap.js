import React, { useEffect, useRef } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { hideInfoBox, showInfoBox } from "../../../features/infobox/infoBoxSlice";

const Kakaomap = ({ vehiclesData, leftPanelWidth }) => {
    const mapRef = useRef(null);
    const markerClickedRef = useRef(false);
    const dispatch = useDispatch();
    const infoBoxVisible = useSelector((state) => state.infoBox.visible);

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            map.relayout();
            const center = map.getCenter();
            map.setCenter(center);
        }
    }, [leftPanelWidth]);

    const handleMarkerClick = (marker, vehicleId, vehicle) => {
        markerClickedRef.current = true;

        if (infoBoxVisible) {
            dispatch(hideInfoBox());
            return;
        }

        const map = mapRef.current;
        if (!map) return;

        const projection = map.getProjection();
        const point = projection.pointFromCoords(marker.getPosition());

        dispatch(showInfoBox({
            x: point.x,
            y: point.y,
            vehicle: {
                ...vehicle,
                id: vehicleId,
                name: vehicle?.name || vehicleId,
            },
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
                {Object.entries(vehiclesData || {}).map(([vehicleId, data]) => {
                    const lat = data.lat;
                    const lng = data.lng;

                    if (typeof lat !== "number" || typeof lng !== "number") {
                        return null;
                    }

                    return (
                        <React.Fragment key={vehicleId}>
                            <MapMarker
                                position={{ lat, lng }}
                                title={`Vehicle: ${data.name || vehicleId}`}
                                onClick={(marker) =>
                                    handleMarkerClick(marker, vehicleId, data)
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
