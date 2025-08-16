import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import useUsers from "../../../Hooks/useUsers";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5;

const AllUsers = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  // const { data: users, isLoading, refetch } = useUsers();
  const { role, isLoading: roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", statusFilter, page],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  

if (roleLoading || isLoading || !role || !users) {
 
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>
    )
}
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

  if (!users || isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const filteredUsers = users.filter((user) =>
    statusFilter === "all" ? true : user.status === statusFilter
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const handleBlock = (email) => {
    axiosSecure
      .patch(`/users/${email}`, {
        status: "blocked",
      })
      .then(() => {
        Swal.fire("Blocked!", "User has been blocked.", "success");
        refetch();
      });
  };

  const handleUnblock = (email) => {
    axiosSecure
      .patch(`/users/${email}`, {
        status: "active",
      })
      .then(() => {
        Swal.fire("Unblocked!", "User has been unblocked.", "success");
        refetch();
      });
  };

  const handleMakeVolunteer = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to make this user a volunteer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make volunteer!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${email}`, {
            role: "volunteer",
          })
          .then(() => {
            Swal.fire("Updated!", "User has been made a volunteer.", "success");
            refetch();
          });
      }
    });
  };

  const handleMakeAdmin = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to make this user an admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${email}`, {
            role: "admin",
          })
          .then(() => {
            Swal.fire("Updated!", "User has been made an admin.", "success");
            refetch();
          });
      }
    });
  };

  const handleMakeDonor = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to make this user a donor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make donor!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${email}`, {
            role: "donor",
          })
          .then(() => {
            Swal.fire("Updated!", "User has been made a donor.", "success");
            refetch();
          });
      }
    });
  };

  return (
  <div className="w-full px-4 md:px-6 p-2 md:p-6 mt-20">
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="status-filter" className="font-medium">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          className="p-2 rounded-md border border-token bg-transparent text-base"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
    {/* Table for md+ screens */}
        <div className="overflow-x-auto rounded-lg mb-6 hidden md:block">
          <table className="min-w-full card">
            <thead>
            <tr>
              <th className="font-semibold py-3 px-4 border-b border-token text-left">
                Avatar
              </th>
              <th className="font-semibold py-3 px-4 border-b border-token text-left">
                Email
              </th>
              <th className="font-semibold py-3 px-4 border-b border-token text-left">
                Name
              </th>
              <th className="font-semibold py-3 px-4 border-b border-token text-left">
                Role
              </th>
              <th className="font-semibold py-3 px-4 border-b border-token text-left">
                Status
              </th>
              <th className="font-semibold py-3 px-4 border-b border-token text-left">
                Actions
              </th>
            </tr>
            </thead>
            <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td
                colSpan={6}
                className="py-4 px-4 text-center text-muted"
                >
                No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <tr key={index || user.id} className="hover-surface transition">
                <td className="py-3 px-4 border-b border-token">
                  <img
                    src={user?.photoURL}
                    alt="avatar"
                    className="rounded-full w-10 h-10 object-cover border-2 border-token"
                  />
                </td>
                <td className="py-3 px-4 border-b border-token">
                  {user.email}
                </td>
                <td className="py-3 px-4 border-b border-token">
                  {user.name}
                </td>
                <td className="py-3 px-4 border-b border-token">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-token font-medium text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        user.role === "admin"
                          ? "bg-indigo-500"
                          : user.role === "volunteer"
                          ? "bg-yellow-500"
                          : user.role === "donor"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-token">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-token font-medium text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        user.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-token">
                  <div className="flex gap-2 flex-wrap">
                    {user.status === "active" && user.role !== "admin" && (
                    <button
                      className="btn btn-outline px-3 py-1 text-sm"
                      onClick={() => handleBlock(user.email)}
                    >
                      Block
                    </button>
                    )}
                    {user.status === "blocked" && (
                    <button
                      className="btn btn-outline px-3 py-1 text-sm"
                      onClick={() => handleUnblock(user.email)}
                    >
                      Unblock
                    </button>
                    )}
                    {role === "admin" &&(<div className="flex gap-2">
                    {user.role !== "volunteer" && (
                    <button
                      className="btn btn-outline px-3 py-1 text-sm"
                      onClick={() => handleMakeVolunteer(user.email)}
                    >
                      Make Volunteer
                    </button>
                    )}
                    {user.role !== "admin" && (
                    <button
                      className="btn btn-outline px-3 py-1 text-sm"
                      onClick={() => handleMakeAdmin(user.email)}
                    >
                      Make Admin
                    </button>
                    )}
                    {user.role !== "donor" && (
                    <button
                      className="btn btn-outline px-3 py-1 text-sm"
                      onClick={() => handleMakeDonor(user.email)}
                    >
                      Make Donor
                    </button>
                    )}
                    </div>)}
                  </div>
                </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        {/* Cards for mobile screens */}
      <div className="md:hidden space-y-4 mb-6">
        {paginatedUsers.length === 0 ? (
          <div className="text-center text-muted py-8 card">
            No users found.
          </div>
        ) : (
          paginatedUsers.map((user, index) => (
            <div
              key={user.id || index}
              className="card p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="rounded-full w-12 h-12 object-cover border-2 border-token"
                />
                <div>
                  <div className="font-semibold">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted">{user.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-token font-medium text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.role === "admin"
                        ? "bg-indigo-500"
                        : user.role === "volunteer"
                        ? "bg-yellow-500"
                        : user.role === "donor"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-token font-medium text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.status === "active" && user.role !== "admin" && (
                  <button
                    className="btn btn-outline text-xs px-3 py-1"
                    onClick={() => handleBlock(user.email)}
                  >
                    Block
                  </button>
                )}
                {user.status === "blocked" && (
                  <button
                    className="btn btn-outline text-xs px-3 py-1"
                    onClick={() => handleUnblock(user.email)}
                  >
                    Unblock
                  </button>
                )}
                {
                    role === "admin" && (<div>
                    {user.role !== "volunteer" && (
                  <button
                    className="btn btn-outline text-xs px-3 py-1"
                    onClick={() => handleMakeVolunteer(user.email)}
                  >
                    Make Volunteer
                  </button>
                )}
                {user.role !== "admin" && (
                  <button
                    className="btn btn-outline text-xs px-3 py-1"
                    onClick={() => handleMakeAdmin(user.email)}
                  >
                    Make Admin
                  </button>
                )}
                {user.role !== "donor" && (
                  <button
                    className="btn btn-outline text-xs px-3 py-1"
                    onClick={() => handleMakeDonor(user.email)}
                  >
                    Make Donor
                  </button>
                )}
                </div>)
                }
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          className={`btn btn-outline px-4 py-1 font-medium text-base transition ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className={`btn btn-outline px-4 py-1 font-medium text-base transition ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
