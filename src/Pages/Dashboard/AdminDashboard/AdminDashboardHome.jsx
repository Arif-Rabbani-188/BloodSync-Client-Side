import React, { useEffect, useState } from "react";
import { FaUsers, FaHandHoldingUsd, FaTint, FaClock, FaUserAlt } from "react-icons/fa";
import useUsers from "../../../Hooks/useUsers";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import useUserRole from "../../../Hooks/useUserRole";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboardHome = () => {
  const { data: users } = useUsers();
  const [requests, setRequests] = useState([]);
  const [funding, setFunding] = useState(0);
  const [donationStatusCount, setDonationStatusCount] = useState({
    pending: 0,
    inprogress: 0,
    done: 0,
    canceled: 0,
  });
  const {role} = useUserRole();
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentFundings, setRecentFundings] = useState([]);
  const [topDonors, setTopDonors] = useState([]);

  // Fetch donation requests and stats
  useEffect(() => {
    axios
      .get("https://blood-sync-server-side.vercel.app/donationRequest")
      .then((res) => {
        const data = res.data || [];
        setRequests(data.length);
        const statusCounts = data.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {});
        setDonationStatusCount({
          pending: statusCounts.pending || 0,
          inprogress: statusCounts.inprogress || 0,
          done: statusCounts.done || 0,
          canceled: statusCounts.canceled || 0,
        });
        // Sort by newest and take last 5 for recent requests
        const sortedRequests = data
          .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
          .slice(0, 5);
        setRecentRequests(sortedRequests);
      });
  }, []);

  // Fetch fundings, total and recent
  useEffect(() => {
    axios.get("https://blood-sync-server-side.vercel.app/fundings").then((res) => {
      const allFundings = res.data || [];
      const total = allFundings.reduce((sum, item) => sum + item.amount, 0);
      setFunding(total);

      // Sort by date and take last 5 for recent fundings
      const sortedFundings = allFundings
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentFundings(sortedFundings);

      // Calculate top donors by summing their total funding
      const donorTotals = {};
      allFundings.forEach(({ name, amount }) => {
        if (!name) return;
        donorTotals[name] = (donorTotals[name] || 0) + amount;
      });
      const top = Object.entries(donorTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      setTopDonors(top);
    });
  }, []);

  const stats = [
    {
      icon: <FaUsers size={32} className="text-blue-600" />,
      count: users?.length || 0,
      title: "Total Donors",
      bg: "bg-blue-50",
    },
    {
      icon: <FaHandHoldingUsd size={32} className="text-green-600" />,
      count: `$${funding.toLocaleString()}`,
      title: "Total Funding",
      bg: "bg-green-50",
    },
    {
      icon: <FaTint size={32} className="text-red-600" />,
      count: requests,
      title: "Blood Requests",
      bg: "bg-red-50",
    },
  ];

  const pieData = {
    labels: ["Pending", "In Progress", "Done", "Canceled"],
    datasets: [
      {
        label: "Donation Requests",
        data: [
          donationStatusCount.pending,
          donationStatusCount.inprogress,
          donationStatusCount.done,
          donationStatusCount.canceled,
        ],
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Donors", "Funding", "Requests"],
    datasets: [
      {
        label: "Overview",
        data: [users?.length || 0, funding, requests],
        backgroundColor: ["#3b82f6", "#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="p-6 md:ml-80 mt-20 md:mt-10 mx-auto">
      <div className="mb-8 bg-white rounded-lg shadow p-6 flex items-center gap-4">
        <div className="text-4xl">🏠</div>
        <div>
          <h2 className="text-2xl font-bold">Welcome to {role === "admin" ? <span>Admin</span> : <span>Volunteer</span>} Dashboard</h2>
          <p className="text-gray-600">
            Manage donors, funding, and blood requests efficiently.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-lg shadow ${stat.bg} p-6 flex flex-col items-center`}
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1">{stat.count}</div>
            <div className="text-gray-700 font-medium">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow p-6 mx-auto">
          <h3 className="text-lg font-semibold mb-4">Donation Request Status</h3>
          <div className="max-h-96">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Overview</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Recent Donation Requests */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaClock /> Recent Donation Requests
        </h3>
        {recentRequests.length === 0 ? (
          <p className="text-gray-500">No recent requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Recipient</th>
                  <th className="py-2 px-4 border-b">Blood Group</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{req.recipientName}</td>
                    <td className="py-2 px-4">{req.bloodGroup}</td>
                    <td className="py-2 px-4">{new Date(req.donationDate).toLocaleDateString()}</td>
                    <td
                      className={`py-2 px-4 font-semibold capitalize ${
                        req.status === "pending"
                          ? "text-yellow-600"
                          : req.status === "inprogress"
                          ? "text-blue-600"
                          : req.status === "done"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Fundings */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaHandHoldingUsd /> Recent Fundings
        </h3>
        {recentFundings.length === 0 ? (
          <p className="text-gray-500">No recent fundings.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Donor</th>
                  <th className="py-2 px-4 border-b">Amount (USD)</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFundings.map((fund) => (
                  <tr key={fund._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{fund.name}</td>
                    <td className="py-2 px-4">${fund.amount.toFixed(2)}</td>
                    <td className="py-2 px-4">{new Date(fund.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Donors */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserAlt /> Top Donors
        </h3>
        {topDonors.length === 0 ? (
          <p className="text-gray-500">No donors yet.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {topDonors.map(([name, total], i) => (
              <li key={i}>
                <span className="font-semibold">{name}</span>: ${total.toFixed(2)}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardHome;
