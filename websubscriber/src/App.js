import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import {ProSidebarProvider} from "react-pro-sidebar";
import {AddPostForm} from "./features/Post/AddPostForm";
import DrivingVehicleList from "./Component/DrivingVehicleList";

const App = () => {
    return (
    <div>
        <ProSidebarProvider>
            <MainPage/>
        </ProSidebarProvider>
    </div>
  );
}


export default App;