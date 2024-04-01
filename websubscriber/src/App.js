import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import 'react-resizable/css/styles.css';
import * as ROSLIB from 'roslib';
import {useSelector} from "react-redux";

const App = () => {

    let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStop"
    });

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

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
        <MainPage/>
    );
}


export default App;

