import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom/client";
import Visualize from "./Panel/Visualize";
import { ProSidebarProvider } from "react-pro-sidebar";
import {Provider} from "react-redux";
import {store} from "./app/store";
import IpInputPage from "./Panel/ipInputPage";
import MainPage from "./Panel/MainPage";
import {ROSProvider} from "./ROSContext";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IpInputPage />
	},{
        path: "/main",
        element: <App/>
    },{
        path: "visualize",
        element: <Visualize/>
    }
]);

root.render(
    // <React.StrictMode> <-- re-render twice error
    <Provider store={store}>
        <ROSProvider>
            <RouterProvider router={router} />
        </ROSProvider>
    </Provider>
    // </React.StrictMode>
);
