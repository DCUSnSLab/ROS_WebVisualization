import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import {AddPostForm} from "./features/Post/AddPostForm";
import DrivingVehicleList from "./Component/DrivingVehicleList";
import 'react-resizable/css/styles.css';
import { ResizableBox } from 'react-resizable';

const App = () => {
    return (
    <div>
        <MainPage/>
    </div>

  );
}


export default App;