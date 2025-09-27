// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ProSidebarProvider } from "react-pro-sidebar";
import { store } from "./app/store";

import App from "./App";
import Start from "./Page/Start";
import Login from "./Page/Login";
import SignUp from "./Page/SignUp";
import Password from "./Page/Password";
import RePassword from "./Page/RePassword";
import ID from "./Page/ID";
import CheckID from "./Page/CheckID";
import Dashboard from "./Page/Dashboard";
import MainPg from "./Page/MainPg";
import MainPgGroup from "./Page/MainPgGroup";
import Setting from "./Page/Setting";
import SettingGroup from "./Page/SettingGroup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Start /> },
            { path: "sign_up", element: <SignUp /> },
            { path: "login", element: <Login /> },
            { path: "password", element: <Password /> },
            { path: "reset_password", element: <RePassword /> },
            { path: "id", element: <ID /> },
            { path: "check_id", element: <CheckID /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "main", element: <MainPg /> },
            { path: "group/main", element: <MainPgGroup /> },
            { path: "setting", element: <Setting /> },
            { path: "group/setting", element: <SettingGroup /> },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);