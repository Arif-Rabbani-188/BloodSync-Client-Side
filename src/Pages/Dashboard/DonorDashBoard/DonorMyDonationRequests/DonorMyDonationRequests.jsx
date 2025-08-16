import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/donationRequest/${user.email}`)
        .then((res) => {
          setRequests(res.data || []);
          setLoading(false);
        })
        .catch(() => setRequests([]));
    }
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    await axiosSecure.patch(`/donationRequestById/${id}`, {
      status: newStatus,
    });
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
    );
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/donationRequestById/${id}`);
      setRequests((prev) => prev.filter((req) => req._id !== id));
      Swal.fire("Deleted!", "Your request has been deleted.", "success");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    );
  }

  const recentRequests = requests
    .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
    .slice(0, 3);

  return (
    <div className="p-4 mt-20 md:mt-10 w-10/12 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome, {user?.displayName || user?.email}!
      </h2>

      {recentRequests.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold mb-2">
            Recent Donation Requests
          </h3>

          {/* Table for md+ screens */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full card">
              <thead>
                <tr className="border-b border-token">
                  <th className="py-2 px-4 border-b">Recipient Name</th>
                  <th className="py-2 px-4 border-b">Location</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Time</th>
                  <th className="py-2 px-4 border-b">Blood Group</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Donor Info</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .sort(
                    (a, b) =>
                      new Date(b.donationDate) - new Date(a.donationDate)
                  )
                  .map((req) => (
                    <tr key={req._id} className="hover-surface text-center">
                      <td className="py-2 px-4 border-b">{req.recipientName}</td>
                      <td className="py-2 px-4 border-b">
                        {req.recipientDistrict}, {req.recipientUpazila}
                      </td>
                      <td className="py-2 px-4 border-b">{req.donationDate}</td>
                      <td className="py-2 px-4 border-b">{req.donationTime}</td>
                      <td className="py-2 px-4 border-b">{req.bloodGroup}</td>
                      <td className="py-2 px-4 border-b capitalize">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-token font-medium text-sm">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              req.status === "pending"
                                ? "bg-yellow-500"
                                : req.status === "inprogress"
                                ? "bg-blue-500"
                                : req.status === "done"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {req.status}
                        </span>
                        {req.status === "inprogress" && (
                          <div className="flex gap-1 mt-1 justify-center">
                            <button
                              className="btn btn-outline text-xs px-2 py-1"
                              onClick={() => handleStatusChange(req._id, "done")}
                            >
                              Done
                            </button>
                            <button
                              className="btn btn-outline text-xs px-2 py-1"
                              onClick={() => handleStatusChange(req._id, "canceled")}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {(req.status === "inprogress" || req.status === "done") &&
                          req.donorName && (
                            <div>
                              <div>{req.donorName}</div>
                              <div className="text-xs text-muted">
                                {req.donorEmail}
                              </div>
                            </div>
                          )}
                      </td>
                      {req.status === "pending" && (
                        <td className="py-2 px-4 border-b">
                          <button
                            className="btn btn-outline text-xs px-3 py-1 mr-2"
                            onClick={() =>
                              navigate(`/dashboard/donation-requests/edit/${req._id}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline text-xs px-3 py-1 mr-2"
                            onClick={() => handleDelete(req._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-outline text-xs px-3 py-1"
                            onClick={() =>
                              navigate(`/dashboard/donation-requests/${req._id}`)
                            }
                          >
                            View
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile screens */}
          <div className="md:hidden flex flex-col gap-4">
            {requests
              .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
              .map((req) => (
                <div
                  key={req._id}
                  className="card p-4"
                >
                  <div className="font-semibold text-lg mb-2">
                    {req.recipientName}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Location:</span>{" "}
                    {req.recipientDistrict}, {req.recipientUpazila}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Date:</span>{" "}
                    {req.donationDate}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Time:</span>{" "}
                    {req.donationTime}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Blood Group:</span>{" "}
                    {req.bloodGroup}
                  </div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-token font-medium text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          req.status === "pending"
                            ? "bg-yellow-500"
                            : req.status === "inprogress"
                            ? "bg-blue-500"
                            : req.status === "done"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {req.status}
                    </span>
                  </div>
                  {req.status === "inprogress" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn btn-outline text-xs px-2 py-1"
                        onClick={() => handleStatusChange(req._id, "done")}
                      >
                        Done
                      </button>
                      <button
                        className="btn btn-outline text-xs px-2 py-1"
                        onClick={() => handleStatusChange(req._id, "canceled")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {req.status === "inprogress" && req.donorName && (
                    <div className="mt-2">
                      <div className="font-medium">Donor Info:</div>
                      <div>{req.donorName}</div>
                      <div className="text-xs text-muted">
                        {req.donorEmail}
                      </div>
                    </div>
                  )}
                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-outline text-xs px-3 py-1"
                        onClick={() =>
                          navigate(`/dashboard/donation-requests/edit/${req._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline text-xs px-3 py-1"
                        onClick={() => handleDelete(req._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-outline text-xs px-3 py-1"
                        onClick={() =>
                          navigate(`/dashboard/donation-requests/${req._id}`)
                        }
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center card p-8 text-center max-w-lg mx-auto mt-10">
          <div className="text-6xl mb-4">🩸</div>
          <h3 className="text-2xl font-bold mb-2">No Donation Requests Yet</h3>
          <p className="text-muted mb-4">
            You haven't created any donation requests. When you do, they will appear here.
          </p>
          <button
            onClick={() => navigate("/dashboard/create-donation")}
            className="btn btn-primary px-5"
          >
            Create a Request
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
