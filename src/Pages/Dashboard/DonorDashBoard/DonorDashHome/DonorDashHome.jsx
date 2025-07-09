import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext";
import axios from "axios";

// Simple avatar generator for creative section

// Creative section: Donor stats and motivation
function DonorHero({ user }) {
const [donations, setDonations] = useState([]);

useEffect(() => {
    if (user?.email) {
        axios
            .get(`http://localhost:3000/donationRequest?email=${user.email}`)
            .then((res) => setDonations(res.data || []))
            .catch(() => setDonations([]));
    }
}, [user]);

return (
    <div
        style={{
            background: "linear-gradient(90deg, #1976d2 60%)",
            borderRadius: 16,
            padding: 32,
            color: "#fff",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 32,
            boxShadow: "0 4px 24px rgba(25,118,210,0.08)",
        }}
    >
        <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>
                Welcome, {user?.displayName || user?.name || "Donor"}!
            </h2>
            <p style={{ margin: "8px 0 0 0", fontSize: 18 }}>
                Thank you for being a life saver.{" "}
                <span role="img" aria-label="heart">
                    ❤️
                </span>
            </p>
            <div style={{ marginTop: 16, fontSize: 16 }}>
                <strong>Total Donations:</strong>{" "}
                <span style={{ fontSize: 22 }}>{donations.length}</span>
            </div>
        </div>
    </div>
);
}

const DonorDashHome = () => {
  const { user, loading } = useContext(AuthContext);

  return (
    <div
      className="md:ml-80 mt-20 md:mt-5 p-4"
      style={{ background: "#f4f8fb", minHeight: "100vh" }}
    >
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 64 }}>Loading...</div>
      ) : (
        <>
          <DonorHero user={user} />
          <RecentDonationRequests userId={user?._id || user?.id} />
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href="/dashboard/my-donation-requests">
              <button
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(25,118,210,0.12)",
                }}
              >
                View My All Requests
              </button>
            </a>
          </div>
          <div
            style={{
              marginTop: 40,
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 2px 12px rgba(25,118,210,0.06)",
              textAlign: "center",
              color: "#1976d2",
              fontSize: 20,
              fontStyle: "italic",
            }}
          >
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
        .get(`http://localhost:3000/donationRequest?email=${user.email}`)
        .then((res) => setRequests(res.data || []))
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [user]);

  if (loading)
    return (
      <div style={{ textAlign: "center", margin: 32 }}>
        Loading recent requests...
      </div>
    );
  if (!requests.length) return null; // Hide section if no requests

  function handleDelete(id) {
    setDeleteId(id);
  }

  function confirmDelete() {
    fetch(`/api/donation-requests/${deleteId}`, { method: "DELETE" }).then(
      () => {
        setRequests((reqs) => reqs.filter((r) => r._id !== deleteId));
        setDeleteId(null);
      }
    );
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
    pending: "#fbc02d",
    inprogress: "#1976d2",
    done: "#388e3c",
    canceled: "#e53935",
  };

  console.log("Requests:", requests);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 2px 12px rgba(25,118,210,0.06)",
        marginBottom: 24,
      }}
    >
      <h3 style={{ marginBottom: 16, color: "#1976d2", fontWeight: 700 }}>
        My Recent Donation Requests
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}
        >
          <thead>
            <tr style={{ background: "#e3f2fd" }}>
              <th style={thStyle}>Recipient Name</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Blood Group</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Donor Info</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={tdStyle}>{req.recipientName}</td>
                <td style={tdStyle}>
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>
                <td style={tdStyle}>{req.donationDate}</td>
                <td style={tdStyle}>{req.donationTime}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: "#1976d2" }}>
                  {req.bloodGroup}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    color: statusColors[req.status] || "#888",
                    fontWeight: 600,
                  }}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </td>
                <td style={tdStyle}>
                  {req.status === "inprogress" && req.donor ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{req.donor.name}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>
                        {req.donor.email}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: "#bbb" }}>-</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <a href={`/dashboard/donation-requests/${req._id}`}>
                    <button style={actionBtnStyle}>View</button>
                  </a>
                  <a href={`/dashboard/donation-requests/edit/${req._id}`}>
                    <button style={actionBtnStyle}>Edit</button>
                  </a>
                  <button
                    style={actionBtnStyle}
                    onClick={() => handleDelete(req._id)}
                  >
                    Delete
                  </button>
                  {req.status === "inprogress" && (
                    <>
                      <button
                        style={{
                          ...actionBtnStyle,
                          background: "#388e3c",
                          color: "#fff",
                        }}
                        onClick={() => handleStatusChange(req._id, "done")}
                      >
                        Done
                      </button>
                      <button
                        style={{
                          ...actionBtnStyle,
                          background: "#e53935",
                          color: "#fff",
                        }}
                        onClick={() => handleStatusChange(req._id, "canceled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 32,
              minWidth: 320,
              boxShadow: "0 4px 24px rgba(25,118,210,0.18)",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 16, fontSize: 18 }}>
              Are you sure you want to delete this request?
            </div>
            <button
              style={{
                ...actionBtnStyle,
                background: "#e53935",
                color: "#fff",
                marginRight: 8,
              }}
              onClick={confirmDelete}
            >
              Yes, Delete
            </button>
            <button
              style={{
                ...actionBtnStyle,
                background: "#e3f2fd",
                color: "#1976d2",
              }}
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

const thStyle = {
  padding: "10px 8px",
  textAlign: "left",
  fontWeight: 700,
  color: "#1976d2",
  fontSize: 15,
  borderBottom: "2px solid #bbdefb",
};

const tdStyle = {
  padding: "8px 8px",
  fontSize: 15,
  color: "#333",
  verticalAlign: "top",
};

const actionBtnStyle = {
  margin: "0 4px 4px 0",
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
  background: "#e3f2fd",
  color: "#1976d2",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 14,
  transition: "background 0.2s",
};

export default DonorDashHome;
