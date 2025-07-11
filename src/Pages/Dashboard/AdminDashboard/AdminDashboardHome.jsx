import React, { use, useEffect, useState } from "react";
import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";
import useUsers from "../../../Hooks/useUsers";
import axios from "axios";

const AdminDashboardHome = () => {
    const{data: users} = useUsers();
    const [requests, setRequests] = useState([]);
    useEffect(() => {
      axios.get('https://blood-sync-server-side.vercel.app/donationRequest')
      .then(response => {
        console.log("Donation Requests:", response.data);
        setRequests(response?.data.length);
      })
      .catch(error => {
        console.error("Error fetching donation requests:", error);
      })
    }, [users]);

    console.log(users);
   
  const stats = [
    {
      icon: <FaUsers size={32} className="text-blue-600" />,
      count: users?.length || 0,
      title: "Total Donors",
      bg: "bg-blue-50",
    },
    {
      icon: <FaHandHoldingUsd size={32} className="text-green-600" />,
      count: "$8,500",
      title: "Total Funding",
      bg: "bg-green-50",
    },
    {
      icon: <FaTint size={32} className="text-red-600" />,
      count: requests || 0,
      title: "Blood Requests",
      bg: "bg-red-50",
    },
  ];
  
  return (
    <div className="p-6 md:ml-80 mt-20 md:mt-10 w-10/12 mx-auto">
      {/* Welcome Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6 flex items-center gap-4">
        <div className="text-4xl">🏠</div>
        <div>
          <h2 className="text-2xl font-bold">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600">
            Manage donors, funding, and blood requests efficiently.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-lg shadow ${stat.bg} p-6 flex flex-col items-center`}
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1">{stat.count}</div>
            <div className="text-gray-700 font-medium">{stat.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardHome;
