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
import Kakaomap from "./Component/kakaomap";
import LabTabs from "./main";
import Combined from "./Panel/combined";
import MainLayout from "./layouts/MainLayout";
import Login from "./Page/Login";
import SignUp from "./Page/SignUp";
import Password from "./Page/Password";
import RePassword from "./Page/RePassword";
import ID from "./Page/ID";
import CheckID from "./Page/CheckID";
import Dashboard from "./Page/Dashboard";

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
    },{
        path: "login",
        element: <Login/>
    },{
        path: "sign_up",
        element: <SignUp/>
    },{
        path: "view_password",
        element: <Password/>
    },{
        path: "view_password/reset_password",
        element: <RePassword/>
    },{
        path: "find_id",
        element: <ID/>
    },{
        path: "find_id/check_id",
        element: <CheckID/>
    },{
        path: "dashboard",
        element: <Dashboard/>
    },{
        path: "test",
        element: <MainLayout/>
    },

]);

root.render(
    // <React.StrictMode> <-- re-render twice error
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    // </React.StrictMode>
);
