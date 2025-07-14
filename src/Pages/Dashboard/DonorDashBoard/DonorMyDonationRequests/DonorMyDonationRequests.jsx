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

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(
          `/donationRequest/${user.email}`
        )
        .then((res) => setRequests(res.data || []))
        .catch(() => setRequests([]));
    }
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    await axiosSecure.patch(
      `/donationRequestById/${id}`,
      {
        status: newStatus,
      }
    );
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
      await axiosSecure.delete(
        `/donationRequestById/${id}`
      );
      setRequests((prev) => prev.filter((req) => req._id !== id));
      Swal.fire("Deleted!", "Your request has been deleted.", "success");
    }
  };

  const recentRequests = requests
    .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
    .slice(0, 3);

  return (
    <div className="p-4 md:ml-80 mt-20 md:mt-10 w-10/12 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome, {user?.displayName || user?.email}!
      </h2>
      {recentRequests.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">
            Recent Donation Requests
          </h3>
          {/* Table for md+ screens */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
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
                    <tr key={req._id} className="hover:bg-gray-50 text-center">
                      <td className="py-2 px-4 border-b">
                        {req.recipientName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {req.recipientDistrict}, {req.recipientUpazila}
                      </td>
                      <td className="py-2 px-4 border-b">{req.donationDate}</td>
                      <td className="py-2 px-4 border-b">{req.donationTime}</td>
                      <td className="py-2 px-4 border-b">{req.bloodGroup}</td>
                      <td className="py-2 px-4 border-b capitalize">
                        <span
                          className={
                            req.status === "pending"
                              ? "text-yellow-600 font-semibold"
                              : req.status === "inprogress"
                              ? "text-blue-600 font-semibold"
                              : req.status === "done"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {req.status}
                        </span>
                        {req.status === "inprogress" && (
                          <div className="flex gap-1 mt-1">
                            <button
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                            >
                              Done
                            </button>
                            <button
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {(req.status === "inprogress" ||
                          req.status === "done") &&
                          req.donorName && (
                            <div>
                              <div>{req.donorName}</div>
                              <div className="text-xs text-gray-500">
                                {req.donorEmail}
                              </div>
                            </div>
                          )}
                      </td>
                      {req.status === "pending" && (
                        <td className="py-2 px-4 border-b">
                          <button
                            className="text-blue-600 underline mr-2"
                            onClick={() =>
                              navigate(
                                `/dashboard/donation-requests/edit/${req._id}`
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 underline mr-2"
                            onClick={() => handleDelete(req._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="text-green-600 underline"
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
              .sort(
                (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
              )
              .map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded shadow p-4 border"
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
                    <span
                      className={
                        req.status === "pending"
                          ? "text-yellow-600 font-semibold"
                          : req.status === "inprogress"
                          ? "text-blue-600 font-semibold"
                          : req.status === "done"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {req.status}
                    </span>
                  </div>
                  {req.status === "inprogress" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        onClick={() => handleStatusChange(req._id, "done")}
                      >
                        Done
                      </button>
                      <button
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
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
                      <div className="text-xs text-gray-500">
                        {req.donorEmail}
                      </div>
                    </div>
                  )}
                  {req.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        className="text-blue-600 underline"
                        onClick={() =>
                          navigate(
                            `/dashboard/edit-donation-request/${req._id}`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 underline"
                        onClick={() => handleDelete(req._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="text-green-600 underline"
                        onClick={() =>
                          navigate(`/dashboard/donation-request/${req._id}`)
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
      )}
    </div>
  );
};

export default DashboardHome;
