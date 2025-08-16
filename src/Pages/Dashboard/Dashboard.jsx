import React from "react";
import { Outlet } from "react-router";
import Aside from "./Aside/Aside";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Aside />
      {/* Full-width content; Root offsets navbar. Desktop gets left pad for the aside. */}
      <main className="lg:pl-80 px-4 md:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
