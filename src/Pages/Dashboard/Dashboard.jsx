import React from "react";
import { Outlet } from "react-router";
import Aside from "./Aside/Aside";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Aside />
      {/* Left padding for desktop aside; Root already offsets the fixed navbar */}
      <main className="lg:pl-80">
        <div className="w-11/12 md:w-10/12 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
