import React from "react";
import { Outlet } from "react-router";
import DonorDashHome from "./DonorDashBoard/DonorDashHome/DonorDashHome";
import Aside from "./Aside/Aside";
import AdminDashboardHome from "./AdminDashboard/AdminDashboardHome";
import useUserRole from "../../Hooks/useUserRole";

const Dashboard = () => {
  const { role } = useUserRole();
  return (
    <div>
      <Aside></Aside>
      <Outlet />
    </div>
  );
};

export default Dashboard;
