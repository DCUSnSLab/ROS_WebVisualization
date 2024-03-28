import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import 'react-resizable/css/styles.css';
import * as ROSLIB from "roslib";
import Visualize from "./Panel/Visualize";
import ErrorBoundary from "./Panel/ErrorBoundary";
import {updateWebPageStatus} from "./features/PublishedTopics/PublishedTopicSlice";
import {useDispatch} from "react-redux";
import {ROSProvider, useROS} from "./ROSContext";


const App = () => {

    const ros = useROS();

    let LoggingRequest = new ROSLIB.Service({
      ros : ros,
      name : '/logging',
      serviceType : 'Logging'
    });

    let requestStop = new ROSLIB.ServiceRequest({
      isLogging : "LoggingStop"
    });

    useEffect(() => {
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
        <ROSProvider>
            <MainPage/>
        </ROSProvider>
    </ErrorBoundary>
  );
}


export default App;