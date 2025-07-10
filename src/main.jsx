import { Children, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Pages/Root/Root";
import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Register from "./Pages/Register/Register";
import AuthProvider from "./Contexts/AuthContext/AuthProvider";
import Login from "./Pages/Login/Login";
import PrivateRoute from "./Route/PrivateRoute/PrivateRoute";
import DonorDashHome from "./Pages/Dashboard/DonorDashBoard/DonorDashHome/DonorDashHome";
import DonorCreateReq from "./Pages/Dashboard/DonorDashBoard/DonorCreateReq/DonorCreateReq";
import DonorMyDonationRequests from "./Pages/Dashboard/DonorDashBoard/DonorMyDonationRequests/DonorMyDonationRequests";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AllUsers from "./Pages/Dashboard/AdminDashboard/AllUsers";
import AllDonationRequests from "./Pages/Dashboard/AdminDashboard/AllDonationRequests";
import PublickDonation from "./Pages/PublicDonationPage/PublickDonation";
import ViewDetailRequest from "./Pages/PublicDonationPage/ViewDetailRequest";
import AdminDashboardHome from "./Pages/Dashboard/AdminDashboard/AdminDashboardHome";
import SearchDonor from "./Pages/SearchDonor/SearchDonor";

const queryClient = new QueryClient();

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
        element: <PublickDonation></PublickDonation>
      },
      {
        path: "donation-requests/:id",
        element: <PrivateRoute><ViewDetailRequest></ViewDetailRequest></PrivateRoute>,
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
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "search-donor",
        element: <SearchDonor></SearchDonor>,
      }
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        index: true,
        element: <DonorDashHome></DonorDashHome>
      },
      {
        path:"admin-home",
        element: <AdminDashboardHome></AdminDashboardHome>
      },
      {
        path: "donor-home",
        element: <DonorDashHome></DonorDashHome>,
      },
      {
        path: "all-users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "all-donation-requests",
        element: <AllDonationRequests></AllDonationRequests>,
      },
      {
        path: "my-donation",
        element: <DonorMyDonationRequests></DonorMyDonationRequests>,
      },
      {
        path: "create-donation",
        element: <DonorCreateReq></DonorCreateReq>,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
   <AuthProvider>
    <RouterProvider router={router}></RouterProvider>
   </AuthProvider>
   </QueryClientProvider>
  </StrictMode>
);
