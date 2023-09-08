import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import First from "./Panel/first";
import Second from "./Panel/second";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "first",
        element: <First />,
      },
      {
        path: "second",
        element: <Second />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);


