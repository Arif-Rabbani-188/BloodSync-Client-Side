import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";

const StatCard = ({ title, value, color }) => (
  <div className={`rounded-2xl p-5 shadow bg-white border-t-4 ${color}`}>
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
  </div>
);

const DonutChart = ({ data }) => {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  let cumulative = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40">
      <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#eee" strokeWidth="20" />
      {data.map((slice, i) => {
        const size = (slice.value / total) * circumference;
        const dashArray = `${size} ${circumference - size}`;
        const dashOffset = circumference - cumulative;
        cumulative += size;
        return (
          <circle
            key={i}
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={slice.color}
            strokeWidth="20"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 80 80)"
          />
        );
      })}
      <text x="80" y="85" textAnchor="middle" className="fill-gray-700 text-lg font-semibold">
        {total}
      </text>
    </svg>
  );
};

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-red-500 rounded-t"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${d.value}`}
          ></div>
          <div className="text-xs mt-1 text-gray-600">{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const Overview = () => {
  const { user, userData } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://blood-sync-server-side.vercel.app/donationRequest")
      .then((res) => setRequests(res.data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === "pending").length;
    const inprogress = requests.filter(r => r.status === "inprogress").length;
    const done = requests.filter(r => r.status === "done" || r.status === "completed").length;
    const mine = requests.filter(r => r.requesterEmail === user?.email).length;
    return { total, pending, inprogress, done, mine };
  }, [requests, user?.email]);

  const donutData = [
    { label: "Pending", value: stats.pending, color: "#f59e0b" },
    { label: "In Progress", value: stats.inprogress, color: "#3b82f6" },
    { label: "Done", value: stats.done, color: "#10b981" },
  ];

  const monthly = useMemo(() => {
    const counts = Array(6).fill(0);
    requests.slice(0, 6).forEach((r, idx) => {
      counts[idx] = (r ? 1 : 0) + counts[idx];
    });
    const labels = ["M1","M2","M3","M4","M5","M6"];
    return labels.map((label, i) => ({ label, value: counts[i] }));
  }, [requests]);

  // Role-specific data for non-admin users (e.g., donors)
  const role = userData?.role || "user";
  const myRequests = useMemo(() => (
    requests.filter(r => r.requesterEmail === user?.email)
  ), [requests, user?.email]);
  const myStats = useMemo(() => {
    const total = myRequests.length;
    const pending = myRequests.filter(r => r.status === "pending").length;
    const inprogress = myRequests.filter(r => r.status === "inprogress").length;
    const done = myRequests.filter(r => r.status === "done" || r.status === "completed").length;
    return { total, pending, inprogress, done };
  }, [myRequests]);
  const donutMyData = [
    { label: "Pending", value: myStats.pending, color: "#f59e0b" },
    { label: "In Progress", value: myStats.inprogress, color: "#3b82f6" },
    { label: "Done", value: myStats.done, color: "#10b981" },
  ];
  const monthlyMy = useMemo(() => {
    const counts = Array(6).fill(0);
    myRequests.slice(0, 6).forEach((r, idx) => { counts[idx] = (r ? 1 : 0) + counts[idx]; });
    const labels = ["M1","M2","M3","M4","M5","M6"];
    return labels.map((label, i) => ({ label, value: counts[i] }));
  }, [myRequests]);

  return (
    <div className="section-y mt-10">
      <div className="container-x">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
      <p className="text-muted">A quick look at the activity across donation requests.</p>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="flex items-center justify-center"><div className="rounded-full h-12 w-12 border-4 animate-spin" style={{borderColor:"var(--color-border)", borderTopColor:"var(--color-primary)"}} /></div>
        </div>
      ) : (
        <>
          {role === "admin" || role === "volunteer" ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <StatCard title="Total" value={stats.total} color="border-red-500" />
                <StatCard title="Pending" value={stats.pending} color="border-yellow-500" />
                <StatCard title="In Progress" value={stats.inprogress} color="border-blue-500" />
                <StatCard title="Completed" value={stats.done} color="border-green-500" />
                <StatCard title="My Requests" value={stats.mine} color="border-purple-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="card r-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Status Breakdown (All)</h2>
                  <div className="flex items-center gap-6">
                    <DonutChart data={donutData} />
                    <div className="space-y-2 text-sm">
                      {donutData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: d.color }}></span>
                          <span className="text-gray-700">{d.label}: </span>
                          <span className="font-semibold">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card r-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Activity (All - Last 6)</h2>
                  <BarChart data={monthly} />
                </div>
              </div>

              {role === "admin" && (
                <div className="mt-8 card r-xl p-6">
                  <h2 className="text-lg font-semibold mb-2">Admin Notes</h2>
                  <p className="text-gray-600 text-sm">Add more detailed analytics here (users, approvals, etc.).</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard title="My Total" value={myStats.total} color="border-purple-500" />
                <StatCard title="My Pending" value={myStats.pending} color="border-yellow-500" />
                <StatCard title="My In Progress" value={myStats.inprogress} color="border-blue-500" />
                <StatCard title="My Completed" value={myStats.done} color="border-green-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="card r-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">My Status Breakdown</h2>
                  <div className="flex items-center gap-6">
                    <DonutChart data={donutMyData} />
                    <div className="space-y-2 text-sm">
                      {donutMyData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: d.color }}></span>
                          <span className="text-gray-700">{d.label}: </span>
                          <span className="font-semibold">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card r-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">My Activity (Last 6)</h2>
                  <BarChart data={monthlyMy} />
                </div>
              </div>
            </>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Overview;
