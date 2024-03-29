import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import 'react-resizable/css/styles.css';
import * as ROSLIB from "roslib";
import Visualize from "./Panel/Visualize";
import ErrorBoundary from "./Panel/ErrorBoundary";
import {updateWebPageStatus} from "./features/PublishedTopics/PublishedTopicSlice";
import {useDispatch, useSelector} from "react-redux";
import {ROSProvider, useROS} from "./ROSContext";


const App = () => {

    return (
        <ErrorBoundary>
            <MainPage/>
        </ErrorBoundary>
    );
}


export default App;

