import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

import Visualize from "./Panel/Visualize";

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route>
            <Route path="/" element={<App />} />
            <Route path="/visualize" element={<Visualize />} />
      </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);