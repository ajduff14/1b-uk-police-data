import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App';
import Force, {
    loader as forceLoader,
  } from "./Force";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/forces/:forceId",
        element: <Force />,
    },
  ]);
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
  