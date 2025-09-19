import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom/client";
import Visualize from "./Panel/Visualize";
import { ProSidebarProvider } from "react-pro-sidebar";
import {Provider} from "react-redux";
import {store} from "./app/store";
import Login from "./Page/Login";
import SignUp from "./Page/SignUp";
import Password from "./Page/Password";
import RePassword from "./Page/RePassword";
import ID from "./Page/ID";
import CheckID from "./Page/CheckID";
import Dashboard from "./Page/Dashboard";
import Start from "./Page/Start";
import MainPg from "./Page/MainPg";
import MainPgGroup from "./Page/MainPgGroup";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

const router = createBrowserRouter([
	{
        path: "/",
        element: <Start/>
    },{
        path: "sign_up",
        element: <SignUp/>
    }, {
        path: "login",
        element: <Login/>
    },{
        path: "password",
        element: <Password/>
    },{
        path: "reset_password",
        element: <RePassword/>
    },{
        path: "id",
        element: <ID/>
    },{
        path: "check_id",
        element: <CheckID/>
    },{
        path: "dashboard",
        element: <Dashboard/>
    },{
        path: "main",
        element: <MainPg/>
    },{
        path: "group/main",
        element: <MainPgGroup/>
    },

]);

root.render(
    // <React.StrictMode> <-- re-render twice error
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    // </React.StrictMode>
);


// 이전페이지
// 	path: "/",
// 	element: <IpInputPage />
// },{
//     path: "main",
//     element: <MainPage/>
// },{
//     path: "visualize",
//     element: <Visualize/>
// },{
//     path: "kakaomap",
//     element: <Kakaomap/>
// },{
//     path: "Combined",
//     element: <Combined/>
// },{
