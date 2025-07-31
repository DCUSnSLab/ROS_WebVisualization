import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import 'react-resizable/css/styles.css';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";
import ErrorBoundary from "./Panel/ErrorBoundary";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Visualize from "./Panel/Visualize";

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


const App = () => {

    let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStop"
    });

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);
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

    return (
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
            <Visualize/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Visualize/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Visualize/>
          </CustomTabPanel>
        </Box>

            {/*<Visualize/>*/}
        </ErrorBoundary>
    );
}

export default App;