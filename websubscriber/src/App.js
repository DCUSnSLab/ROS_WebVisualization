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
    useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      dispatch(updateWebPageStatus(true));
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