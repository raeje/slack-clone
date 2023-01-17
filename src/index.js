import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { AuthOutlet, CreateChannel } from "./routes";
import { Authentication, Loading, Messenger } from "./pages";
import Conversation from "./routes/Conversation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" />,
  },
  {
    path: "/auth",
    element: <Authentication />,
    children: [
      {
        path: "/auth/login",
        element: <AuthOutlet action="Login" />,
      },
      {
        path: "/auth/register",
        element: <AuthOutlet action="Register" />,
      },
    ],
  },
  {
    path: "/loading",
    element: <Loading />,
  },
  {
    path: "/slack",
    element: <Messenger />,
    children: [
      {
        path: "/slack/direct-message/:id",
        element: <Conversation />,
      },
      {
        path: "/slack/create-channel",
        element: <CreateChannel />,
      },
      {
        path: "/slack/channel/:id",
        element: <Conversation />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
