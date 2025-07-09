import { Children, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Pages/Root/Root";
import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Register from "./Pages/Register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      { index: true, element: <Home></Home> },
      {
        path: "home",
        element: <Home></Home>,
      },
      {
        path: "donation-requests",
        element: <div>This is the About Page of BloodSync.</div>,
      },
      {
        path: "funding",
        element: <div>This is the Complaint Page of BloodSync.</div>,
      },
      {
        path: "blog",
        element: <div>This is the Blog Page of BloodSync.</div>,
      },
      {
        path: "login",
        element: <div>This is the Login Page of BloodSync.</div>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        index: true,
        element: <div>This is the Dashboard Home Page of BloodSync.</div>,
      },
      {
        path: "profile",
        element: <div>This is the Profile Page of BloodSync.</div>,
      },
      {
        path: "settings",
        element: <div>This is the Settings Page of BloodSync.</div>,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
