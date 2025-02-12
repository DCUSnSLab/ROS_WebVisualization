import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom/client";
import Visualize from "./Panel/Visualize";
import { ProSidebarProvider } from "react-pro-sidebar";
import {Provider} from "react-redux";
import {store} from "../../websubscriber/src/app/store";
import IpInputPage from "./Panel/ipInputPage";
import MainPage from "./Panel/MainPage";
import {ROSProvider} from "./ROSContext";
import Kakaomap from "./Component/kakaomap";
import LabTabs from "./main";
import Combined from "./Panel/combined";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IpInputPage />
    },{
        path: "main",
        element: <MainPage/>
    },{
        path: "visualize",
        element: <Visualize/>
    },{
        path: "kakaomap",
        element: <Kakaomap/>
    },{
        path: "Combined",
        element: <Combined/>
    }
]);

root.render(
    // <React.StrictMode> <-- re-render twice error
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    // </React.StrictMode>
);
