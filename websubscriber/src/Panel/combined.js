'use client';
import React, {useEffect, useState} from 'react';
import './ipInputPage.css';
import './Visualize.css';
import * as ROSLIB from "roslib";
import {useDispatch, useSelector} from "react-redux";
import { addServer } from "../features/IPserver/IpServer";
import Visualize from "./Visualize";
import Kakaomap from "../Component/kakaomap";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MainPage from "./MainPage";
import ErrorBoundary from "./ErrorBoundary";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{
        display: value === index ? 'block' : 'none',
      }}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}


CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Combined() {
    const dispatch = useDispatch();
    const [ip, setIp] = useState('');
    const [isConnected, setIsConnected] = useState(false);
let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStop"
    });

    // const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);
    const [value, setValue] = React.useState(0);

      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        let LoggingRequest = new ROSLIB.Service({
            ros : ros,
            name : '/logging',
            serviceType : 'Logging'
        });
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            LoggingRequest.callService(requestStop, function(result) {
                console.log(result)
            });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {

          window.removeEventListener('beforeunload', handleBeforeUnload);

        };

  }, []);
    const handleIpChange = (e) => {
        setIp(e.target.value);
    };

    const ipConnectionCheck = () => {
        const fullIp = `ws://${ip}:9090`;
        let ros = new ROSLIB.Ros({
            url: fullIp
        });

        ros.on('connection', function () {
            alert("Connected!");
            setIsConnected(true);
            dispatch(addServer(fullIp));
        });

        ros.on('error', function (error) {
            console.error("Connection error:", error);
            alert("Failed to connect. Please check the IP and try again.");
        });

        ros.on('close', function () {
            console.log("Connection closed.");
            alert("Connection closed.");
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Header Section for IP Input */}

            {/* Main Content Section */}
            <div style={{ display: "flex", flex: 1, overflow: "auto" }}>
                {/* Map Section */}
                <ErrorBoundary>
             <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
          </Box>
                 <CustomTabPanel value={value} index={0}>
                     <div style={{backgroundColor: "#f1f3f5", padding: "10px", borderBottom: "1px solid #ddd"}}>
                         <h1>ROS Connection</h1>
                         <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                             <input
                                 type="text"
                                 placeholder="Enter IP address"
                                 style={{flex: 1, padding: "10px", fontSize: "16px"}}
                                 value={ip}
                                 onChange={handleIpChange}
                             />
                             <button
                                 onClick={ipConnectionCheck}
                                 style={{
                                     padding: "10px 20px",
                                     fontSize: "16px",
                                     backgroundColor: isConnected ? "green" : "blue",
                                     color: "white",
                                     border: "none",
                                     cursor: "pointer"
                                 }}
                             >
                                 {isConnected ? "Connected" : "Connect"}
                             </button>
                         </div>
                         <p style={{marginTop: "5px", fontSize: "14px"}}>
                             Status: {isConnected ? "Connected" : "Not Connected"}
                         </p>
                     </div>
                     <MainPage/>
                 </CustomTabPanel>
                 <CustomTabPanel value={value} index={1}>
                     <MainPage/>
                 </CustomTabPanel>
                 <CustomTabPanel value={value} index={2}>
                     <MainPage/>
                 </CustomTabPanel>
             </Box>
                    {/*<Visualize/>*/}
                </ErrorBoundary>
            </div>
        </div>
    );
}
