import React, {useEffect, useState} from 'react';
import MainPage from "./Panel/MainPage";
import {ProSidebarProvider} from "react-pro-sidebar";

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