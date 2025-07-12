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
import RequestViewDetail from "./Pages/DonationRequestDetail/RequestViewDetail";
import ContentPage from "./Pages/ContentManagment/ContentPage";
import AddBlogs from "./Pages/ContentManagment/AddBlogs";
import AllBlogs from "./Pages/Blogs/AllBlogs";
import SingleBlog from "./Pages/Blogs/SingleBlog";
import DashboardHome from "./Pages/Dashboard/DashboardHome/DashboardHome";
import Error from "./Pages/Error/Error";
import AllFunding from "./Pages/Funding/AllFunding";
import GiveFund from "./Pages/Funding/GiveFund";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <Error />, // Add error page for root and its children
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
        element: <PrivateRoute><AllFunding></AllFunding></PrivateRoute>,
      },
      {
        path: "give-fund",
        element: <PrivateRoute><GiveFund></GiveFund></PrivateRoute>
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
      },
      {
        path:"blogs",
        element: <AllBlogs></AllBlogs>
      },
      {
        path: "blogs/:id",
        element:<SingleBlog></SingleBlog>
      },
      {
        path: "/*",
        element: <Error></Error>
      }
    ],
  },
  {
    path: "dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    errorElement: <Error />, // Add error page for dashboard and its children
    children: [
      {
        index: true,
        element: <PrivateRoute><DashboardHome></DashboardHome></PrivateRoute>
      },
      {
        path:"admin-home",
        element: <PrivateRoute><AdminDashboardHome></AdminDashboardHome></PrivateRoute>
      },
      {
        path: "donor-home",
        element: <PrivateRoute><DonorDashHome></DonorDashHome></PrivateRoute>,
      },
      {
        path: "donation-requests/:id",
        element: <PrivateRoute><ViewDetailRequest></ViewDetailRequest></PrivateRoute>,
      },
      {
        path: "donation-requests/edit/:id",
        element: <PrivateRoute><RequestViewDetail></RequestViewDetail></PrivateRoute>,
      },
      {
        path: "all-users",
        element: <PrivateRoute><AllUsers></AllUsers></PrivateRoute>,
      },
      {
        path: "all-donation-requests",
        element: <PrivateRoute><AllDonationRequests></AllDonationRequests></PrivateRoute>,
      },
      {
        path: "my-donation",
        element: <PrivateRoute><DonorMyDonationRequests></DonorMyDonationRequests></PrivateRoute>,
      },
      {
        path: "create-donation",
        element: <PrivateRoute><DonorCreateReq></DonorCreateReq></PrivateRoute>,
      },
      {
        path: "content-management",
        element: <PrivateRoute><ContentPage></ContentPage></PrivateRoute>
      },
      {
        path: "content-management/add-blog",
        element: <PrivateRoute><AddBlogs></AddBlogs></PrivateRoute>
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
