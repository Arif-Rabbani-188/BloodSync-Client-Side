import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import axios from "axios";
import useUserRole from "../../../../Hooks/useUserRole";
import { Link } from "react-router-dom";

// Creative section: Donor stats and motivation
function DonorHero({ user }) {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:3000/donationRequest/${user.email}`)
        .then((res) => setDonations(res.data || []))
        .catch(() => setDonations([]));
    }
  }, [user]);

  const { role } = useUserRole();

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-700/60 rounded-xl p-8 text-white mb-8 flex items-center gap-8 shadow-lg">
      <div>
        <h2 className="m-0 font-bold text-2xl md:text-3xl">
          Welcome, {user?.displayName || user?.name || "Donor"}!
        </h2>
        <p className="mt-2 text-lg">
          Thank you for being a life saver.{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </p>
        <div className="mt-4 text-base">
          <strong>Total Donations:</strong>{" "}
          <span className="text-2xl">{donations.length}</span>
        </div>
        <div className="mt-4 text-base">
          <strong>Role:</strong> <span className="text-base">{role}</span>
        </div>
      </div>
    </div>
  );
}

const DonorDashHome = () => {
  const { user, loading } = useContext(AuthContext);

  return (
    <div className="md:ml-80 mt-20 md:mt-5 p-4 bg-[#f4f8fb] min-h-screen">
      {loading ? (
        <div className="text-center mt-16">Loading...</div>
      ) : (
        <>
          <DonorHero user={user} />
          <RecentDonationRequests userId={user?._id || user?.id} />
          <div className="mt-8 text-center">
            <Link to="/dashboard/my-donation">
              <button className="bg-blue-700 text-white rounded-lg px-6 py-2 font-semibold text-base shadow-md hover:bg-blue-800 transition">
                View My All Requests
              </button>
            </Link>
          </div>
          <div className="mt-10 bg-white rounded-xl p-6 shadow-md text-center text-blue-700 text-xl italic">
            "A single pint can save three lives, a single gesture can create a
            million smiles."
          </div>
        </>
      )}
    </div>
  );
};

function RecentDonationRequests({ userId }) {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/donationRequest/${user.email}`)
        .then((res) => setRequests(res.data || []))
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [user]);

  if (loading)
    return <div className="text-center my-8">Loading recent requests...</div>;
  if (!requests.length) return null;

  function handleDelete(id) {
    setDeleteId(id);
  }

  function confirmDelete() {
    fetch(`http://localhost:3000/donationRequestById/${deleteId}`, {
      method: "DELETE",
    }).then(() => {
      setRequests((reqs) => reqs.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    });
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  function handleStatusChange(id, status) {
    fetch(`/api/donation-requests/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setRequests((reqs) =>
          reqs.map((r) => (r._id === id ? { ...r, status: updated.status } : r))
        );
      });
  }

  const statusColors = {
    pending: "text-yellow-600",
    inprogress: "text-blue-700",
    done: "text-green-700",
    canceled: "text-red-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
      <h3 className="mb-4 text-blue-700 font-bold text-xl">
        My Recent Donation Requests
      </h3>
      {/* Table for desktop, cards for mobile */}
      <div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className={thClass}>Recipient Name</th>
                <th className={thClass}>Location</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Time</th>
                <th className={thClass}>Blood Group</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Donor Info</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests
                .slice(0, 3)
                .map((req) => (
                  <tr key={req._id} className="border-b border-gray-100">
                    <td className={tdClass}>{req.recipientName}</td>
                    <td className={tdClass}>
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>
                    <td className={tdClass}>{req.donationDate}</td>
                    <td className={tdClass}>{req.donationTime}</td>
                    <td className="font-bold text-blue-700 px-2 py-2 text-sm">
                      {req.bloodGroup}
                    </td>
                    <td
                      className={`${tdClass} font-semibold ${
                        statusColors[req.status] || "text-gray-500"
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </td>
                    <td className={tdClass}>
                      {req.status !== "cancelled" && req.donorEmail ? (
                        <div>
                          <div className="font-semibold">{req.donorName}</div>
                          <div className="text-xs text-gray-500">
                            {req.donorEmail}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    {req.status === "pending" ? (
                      <td className={tdClass}>
                        <a href={`/dashboard/donation-requests/${req._id}`}>
                          <button className={actionBtnClass}>View</button>
                        </a>
                        <a href={`/dashboard/donation-requests/edit/${req._id}`}>
                          <button className={actionBtnClass}>Edit</button>
                        </a>
                        <button
                          className={actionBtnClass}
                          onClick={() => handleDelete(req._id)}
                        >
                          Delete
                        </button>
                        {req.status === "inprogress" && (
                          <>
                            <button
                              className={`${actionBtnClass} bg-green-700 text-white hover:bg-green-800`}
                              onClick={() => handleStatusChange(req._id, "done")}
                            >
                              Done
                            </button>
                            <button
                              className={`${actionBtnClass} bg-red-600 text-white hover:bg-red-700`}
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td className={tdClass}>
                        <span className="text-gray-300">-</span>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {requests.slice(0, 3).map((req) => (
            <div
              key={req._id}
              className="border rounded-lg shadow p-4 bg-blue-50"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-blue-700 text-lg">
                  {req.recipientName}
                </div>
                <div
                  className={`font-semibold text-sm ${
                    statusColors[req.status] || "text-gray-500"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </div>
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Location:</span>{" "}
                {req.recipientDistrict}, {req.recipientUpazila}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Date:</span> {req.donationDate}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Time:</span> {req.donationTime}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Blood Group:</span>{" "}
                <span className="font-bold text-blue-700">
                  {req.bloodGroup}
                </span>
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Donor Info:</span>{" "}
                {req.status !== "canceled" && req.donorEmail ? (
                  <span>
                    <span className="font-semibold">{req.donorName}</span>
                    <span className="block text-xs text-gray-500">
                      {req.donorEmail}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Link to={`/dashboard/donation-requests/${req._id}`}>
                  <button className={actionBtnClass}>View</button>
                </Link>
                {req.status === "pending" && (
                  <>
                    <Link to={`/dashboard/donation-requests/edit/${req._id}`}>
                      <button className={actionBtnClass}>Edit</button>
                    </Link>
                    <button
                      className={actionBtnClass}
                      onClick={() => handleDelete(req._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
                {req.status === "inprogress" && (
                  <>
                    <button
                      className={`${actionBtnClass} bg-green-700 text-white hover:bg-green-800`}
                      onClick={() => handleStatusChange(req._id, "done")}
                    >
                      Done
                    </button>
                    <button
                      className={`${actionBtnClass} bg-red-600 text-white hover:bg-red-700`}
                      onClick={() => handleStatusChange(req._id, "canceled")}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-8 min-w-[320px] shadow-xl text-center">
            <div className="mb-4 text-lg">
              Are you sure you want to delete this request?
            </div>
            <button
              className="mr-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
              onClick={confirmDelete}
            >
              Yes, Delete
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
              onClick={cancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const thClass =
  "px-3 py-2 text-left font-bold text-blue-700 text-sm border-b-2 border-blue-200";
const tdClass = "px-2 py-2 text-sm text-gray-800 align-top";
const actionBtnClass =
  "mr-1 mb-1 px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold text-xs hover:bg-blue-200 transition";

export default DonorDashHome;
