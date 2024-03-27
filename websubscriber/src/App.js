import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import 'react-resizable/css/styles.css';
import * as ROSLIB from "roslib";
import Visualize from "./Panel/Visualize";
import ErrorBoundary from "./Panel/ErrorBoundary";
import {updateWebPageStatus} from "./features/PublishedTopics/PublishedTopicSlice";
import {useDispatch} from "react-redux";


const App = () => {
    const dispatch = useDispatch()

    const ros = new ROSLIB.Ros({
        url : 'ws://203.250.33.143:9090'
    });

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
            dispatch(updateWebPageStatus(true));
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
    <div>
        <ErrorBoundary>
            <MainPage/>
        </ErrorBoundary>
    </div>

  );
}


export default App;