import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import React from "react";
import ReactDOM from "react-dom/client";
import Visualize from "./Panel/Visualize";
import MainPage from "./Panel/MainPage";
import { ProSidebarProvider } from "react-pro-sidebar";
import {Provider} from "react-redux";
import {store} from "./app/store";

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />
	},{
    path: "/main",
        element: <MainPage/>
    },{
    path: "visualize",
        element: <Visualize/>
    }
]);

root.render(
    // <React.StrictMode> <-- re-render twice error

    <Provider store={store}>
        <ProSidebarProvider>
            <RouterProvider router={router} />
        </ProSidebarProvider>
    </Provider>

    // </React.StrictMode>
);
