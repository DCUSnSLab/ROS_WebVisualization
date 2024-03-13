import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import 'react-resizable/css/styles.css';
import * as ROSLIB from "roslib";
import Visualize from "./Panel/Visualize";


const App = () => {

    return (
    <div>
        {/*<MainPage/>*/}
        <Visualize/>
    </div>

  );
}


export default App;