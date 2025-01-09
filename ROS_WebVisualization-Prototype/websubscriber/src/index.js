import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom/client";
import Visualize from "./Panel/Visualize";
import { ProSidebarProvider } from "react-pro-sidebar";
import {Provider} from "react-redux";
import {store} from "../../../../PycharmProjects/eunviz/eunviz/src/store";
import IpInputPage from "./Panel/ipInputPage";
import MainPage from "./Panel/MainPage";
import {ROSProvider} from "./ROSContext";
import Kakaomap from "./Component/kakaomap";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IpInputPage />
	},{
        path: "main",
        element: <App/>
    },{
        path: "visualize",
        element: <Visualize/>
    },{
        path: "kakaomap",
        element: <Kakaomap/>
    }
]);

root.render(
    // <React.StrictMode> <-- re-render twice error
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    // </React.StrictMode>
);
