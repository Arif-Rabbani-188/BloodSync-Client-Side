import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import Swal from "sweetalert2";
import useUserRole from "../../../Hooks/useUserRole";
import useUsers from "../../../Hooks/useUsers";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../../Components/Loader/Loader";

const PAGE_SIZE = 5;

const AllDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { role , isLoading : roleLoading} = useUserRole();
  const {data: users, isLoading} = useUsers();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(
          `/donationRequest`
        );
        setRequests(res.data || []);
        setError("");
      } catch {
        setRequests([]);
        setError("Failed to fetch donation requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const totalPages = Math.ceil(requests.length / PAGE_SIZE);

  const handleStatusChange = async (id, newStatus) => {
    const { isConfirmed } = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to mark this request as "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.patch(
        `/donationRequestById/${id}`,
        {
          status: newStatus,
        }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
      Swal.fire("Updated!", "Status has been updated.", "success");
    } catch {
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(
        `/donationRequestById/${id}`
      );
      setRequests((prev) => prev.filter((req) => req._id !== id));
      Swal.fire("Deleted!", "The request has been deleted.", "success");
    } catch {
      Swal.fire("Error", "Failed to delete request.", "error");
    }
  };

  // Calculate current page requests slice
  const currentRequests = requests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // if (loading) {
  //   return (
  //     <div className="p-4 md:ml-80 mt-20 md:mt-10 w-10/12 mx-auto text-center text-lg text-gray-600">
  //       Loading donation requests...
  //     </div>
  //   );
  // }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;

  if (error) {
    return (
  <div className="p-4 md:ml-80 mt-20 md:mt-10 w-10/12 mx-auto text-center text-red-600">
        {error}
      </div>
    );
  }

  if (roleLoading || isLoading || !role || !users) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;
  if (role !== "admin" && role !== "volunteer") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-2">
            Access Denied
          </h1>
          <p className="text-lg text-muted">
            You do not have the necessary permissions to view this page.
            <br />
            Please contact your administrator if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  return (
  <div className="p-4 mt-20 md:mt-10 w-full px-4 md:px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Welcome, {user?.displayName || user?.email}!
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-muted">No donation requests found.</p>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-4">
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
                {currentRequests.map((req) => (
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
                      {req.status === "inprogress" && req.donorName && (
                        <div>
                          <div>{req.donorName}</div>
                          <div className="text-xs text-muted">
                            {req.donorEmail}
                          </div>
                        </div>
                      )}
                    </td>
                    {role === "admin" && (
                      <td className="py-2 px-4 border-b">
                        <button
                          className="btn btn-outline text-xs px-3 py-1 mr-2"
                          onClick={() =>
                            navigate(
                              `/dashboard/donation-requests/edit/${req._id}`
                            )
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
          <div className="block md:hidden space-y-4">
            {currentRequests.map((req) => (
              <div
                key={req._id}
                className="card p-4 flex flex-col gap-2"
              >
                <div>
                  <span className="font-semibold">Recipient Name: </span>
                  {req.recipientName}
                </div>
                <div>
                  <span className="font-semibold">Location: </span>
                  {req.recipientDistrict}, {req.recipientUpazila}
                </div>
                <div>
                  <span className="font-semibold">Date: </span>
                  {req.donationDate}
                </div>
                <div>
                  <span className="font-semibold">Time: </span>
                  {req.donationTime}
                </div>
                <div>
                  <span className="font-semibold">Blood Group: </span>
                  {req.bloodGroup}
                </div>
                <div>
                  <span className="font-semibold">Status: </span>
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
                  {req.status === "inprogress" && (
                    <div className="flex gap-2 mt-1">
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
                </div>
                {req.status === "inprogress" && req.donorName && (
                  <div>
                    <span className="font-semibold">Donor Info: </span>
                    <div>{req.donorName}</div>
                    <div className="text-xs text-muted">
                      {req.donorEmail}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    className="btn btn-outline text-xs px-3 py-1"
                    onClick={() =>
                      navigate(`/dashboard/edit-donation-request/${req._id}`)
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
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      pageNum === currentPage
                        ? "bg-[var(--color-primary)] text-white border-transparent"
                        : "border-token hover-surface"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllDonationRequests;
