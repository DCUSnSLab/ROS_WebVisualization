/* global kakao */
import React, { useEffect, useState } from "react";
import * as ROSLIB from "roslib";
import { Map, MapInfoWindow, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { useDispatch } from "react-redux";
import { addServer } from "../features/IPserver/IpServer";

const Kakaomap = () => {
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState([]); // 차량 리스트
  const [vehiclesData, setVehiclesData] = useState({});
  const [openInfoWindows, setOpenInfoWindows] = useState({});
  const [userIP, setUserIP] = useState("");
  const [newVehicleName, setNewVehicleName] = useState("");
  const [selectedIP, setSelectedIP] = useState(null); // 선택한 차량 IP

  useEffect(() => {
    const rosConnections = {};

    vehicles.forEach(({ ip, name }) => {
      if (rosConnections[ip]) return;

      const ros = new ROSLIB.Ros({ url: ip });

      ros.on("connection", () => {
        console.log(`Connected to WebSocket server at ${ip}`);
      });

      ros.on("error", (error) => {
        console.error(`Error connecting to WebSocket server at ${ip}`, error);
      });

      ros.on("close", () => {
        console.log(`Connection to WebSocket server at ${ip} closed.`);
      });

      const topic = new ROSLIB.Topic({
        ros: ros,
        name: "/ublox/fix",
        messageType: "sensor_msgs/NavSatFix",
      });

      topic.subscribe((message) => {
        setVehiclesData((prevData) => {
          const currentWaypoints = prevData[ip]?.waypoints || [];
          const newWaypoint = { lat: message.latitude, lng: message.longitude };

          return {
            ...prevData,
            [ip]: {
              lat: message.latitude,
              lng: message.longitude,
              waypoints: [...currentWaypoints, newWaypoint],
              name,
            },
          };
        });
      });

      rosConnections[ip] = { ros, topic };
    });

    return () => {
      Object.entries(rosConnections).forEach(([ip, { ros, topic }]) => {
        console.log(`Unsubscribing from ${ip}`);
        topic.unsubscribe();
        ros.close();
      });
    };
  }, [vehicles]);

  const addVehicle = () => {
    if (userIP && newVehicleName) {
      const vehicleIP = `ws://${userIP}:9090`;
      setVehicles((prev) => [...prev, { ip: vehicleIP, name: newVehicleName }]);
      setUserIP("");
      setNewVehicleName("");
    }
  };

  const removeVehicle = (ip) => {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.ip !== ip));
    setVehiclesData((prev) => {
      const newData = { ...prev };
      delete newData[ip];
      return newData;
    });
  };

  const toggleInfoWindow = (ip) => {
    setOpenInfoWindows((prev) => ({
      ...prev,
      [ip]: !prev[ip],
    }));
  };

  const handleMarkerClick = (ip) => {
    dispatch(addServer(ip));
    setSelectedIP(ip);
    alert(`선택된 차량 IP: ${ip}`);
  };

  return (
    <div>
      <div style={{ padding: "10px", backgroundColor: "#f8f9fa", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="IP"
          value={userIP}
          onChange={(e) => setUserIP(e.target.value)}
        />
        <input
          type="text"
          placeholder="Vehicle Name"
          value={newVehicleName}
          onChange={(e) => setNewVehicleName(e.target.value)}
        />
        <button onClick={addVehicle}>Add Vehicle</button>
      </div>

      <div style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h4>🚗 차량 목록</h4>
        <ul>
          {vehicles.map(({ ip, name }) => (
            <li key={ip} style={{ fontWeight: selectedIP === ip ? "bold" : "normal", color: selectedIP === ip ? "red" : "black" }}>
              <h5>
                {name} ({ip})
                <button onClick={() => removeVehicle(ip)} style={{ marginLeft: "10px" }}>
                  Remove
                </button>
              </h5>
            </li>
          ))}
        </ul>
      </div>

      <Map center={{ lat: 35.9138, lng: 128.8036 }} style={{ width: "100%", height: "90vh" }} level={5}>
        {Object.entries(vehiclesData).map(([ip, data]) => (
          <React.Fragment key={ip}>
            <MapMarker
              position={{ lat: data.lat, lng: data.lng }}
              clickable={true}
              title={`Vehicle: ${data.name}`}
              onClick={() => handleMarkerClick(ip)}
            />
            {openInfoWindows[ip] && (
              <MapInfoWindow position={{ lat: data.lat, lng: data.lng }} removable={true} onCloseClick={() => toggleInfoWindow(ip)}>
                <div style={{ padding: "10px", width: "200px" }}>
                  <h4 style={{ margin: "0 0 10px 0" }}>{data.name}</h4>
                  <p>IP: {ip}</p>
                  <p>Lat: {data.lat.toFixed(6)}</p>
                  <p>Lng: {data.lng.toFixed(6)}</p>
                </div>
              </MapInfoWindow>
            )}
            <Polyline path={data.waypoints} strokeWeight={3} strokeColor="#FF0000" strokeOpacity={0.8} strokeStyle="solid" />
          </React.Fragment>
        ))}
      </Map>
    </div>
  );
};

export default Kakaomap;
