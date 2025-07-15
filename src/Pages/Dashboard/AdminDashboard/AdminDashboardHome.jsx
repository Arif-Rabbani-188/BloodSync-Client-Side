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
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import CountUp from "react-countup";

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
  const { role } = useUserRole();
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentFundings, setRecentFundings] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  const axiosSecure = useAxiosSecure();

  // Fetch donation requests and stats
  useEffect(() => {
    axiosSecure
      .get("/donationRequest")
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
  }, [axiosSecure]);

  // Fetch fundings, total and recent
  useEffect(() => {
    axiosSecure.get("/fundings").then((res) => {
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
  }, [axiosSecure]);

  // Fetch recent 5 messages
  useEffect(() => {
    axios
      .get("https://blood-sync-server-side.vercel.app/api/messages")
      .then((res) => {
        const messages = res.data || [];
        const sortedMessages = messages
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentMessages(sortedMessages);
      })
      .catch((error) => {
        console.error("Failed to fetch recent messages:", error);
        setRecentMessages([]);
      });
  }, []);

  const stats = [
    {
      icon: <FaUsers size={32} className="text-blue-600" />,
      count: <CountUp end={users?.length || 0} duration={5} separator="," />,
      title: "Total Donors",
      bg: "bg-blue-50",
    },
    {
      icon: <FaHandHoldingUsd size={32} className="text-green-600" />,
      count: (
        <>
          $
          <CountUp
            end={funding}
            duration={5}
            separator=","
            decimals={2}
            decimal="."
          />
        </>
      ),
      title: "Total Funding",
      bg: "bg-green-50",
    },
    {
      icon: <FaTint size={32} className="text-red-600" />,
      count: <CountUp end={requests} duration={5} separator="," />,
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
    <div className="p-6 md:ml-80 mt-20 md:mt-10 mx-auto max-w-screen-xl">
      <div className="mb-8 bg-white rounded-lg shadow p-6 flex items-center gap-4">
        <div className="text-4xl">🏠</div>
        <div>
          <h2 className="text-2xl font-bold">
            Welcome to{" "}
            {role === "admin" ? <span>Admin</span> : <span>Volunteer</span>} Dashboard
          </h2>
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
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaClock /> Recent Donation Requests
        </h3>
        {recentRequests.length === 0 ? (
          <p className="text-gray-500">No recent requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border rounded table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Recipient
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Blood Group
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Date
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">
                      {req.recipientName}
                    </td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">
                      {req.bloodGroup}
                    </td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">
                      {new Date(req.donationDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-2 px-3 md:px-4 font-semibold capitalize whitespace-nowrap text-sm md:text-base ${
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

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📩 Recent Messages from Home contact
        </h3>
        {recentMessages.length === 0 ? (
          <p className="text-gray-500">No recent messages.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border rounded table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Name
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Email
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Phone
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-normal text-sm md:text-base max-w-xs ">
                    Message
                  </th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => (
                  <tr key={msg._id} className="border-b hover:bg-gray-50 align-top">
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">{msg.name}</td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">{msg.email}</td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">{msg.phone}</td>
                    <td className="py-2 px-3 md:px-4 whitespace-normal max-w-xs text-sm md:text-base">{msg.message}</td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Fundings */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaHandHoldingUsd /> Recent Fundings
        </h3>
        {recentFundings.length === 0 ? (
          <p className="text-gray-500">No recent fundings.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border rounded table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">Donor</th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">Amount (USD)</th>
                  <th className="py-2 px-3 md:px-4 border-b whitespace-nowrap text-sm md:text-base">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFundings.map((fund) => (
                  <tr key={fund._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">{fund.name}</td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">${fund.amount.toFixed(2)}</td>
                    <td className="py-2 px-3 md:px-4 whitespace-nowrap text-sm md:text-base">{new Date(fund.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Donors */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserAlt /> Top Donors
        </h3>
        {topDonors.length === 0 ? (
          <p className="text-gray-500">No donors yet.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm md:text-base">
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
