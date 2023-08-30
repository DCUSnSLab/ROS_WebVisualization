import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import First from "./Component/first";
import Second from "./Component/second";

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


