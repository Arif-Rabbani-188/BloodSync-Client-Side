import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Contexts/AuthContext/AuthContext"; // ✅ correct import
import axios from "axios";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorCreateReq = () => {
  const { user, userData } = useContext(AuthContext);

  const [districts, setDistricts] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const axiosSecure = useAxiosSecure();

  // ✅ Fixed fetch
  useEffect(() => {
    fetch("/distric.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load district data");
        return res.json();
      })
      .then((data) => setDistricts(data))
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setFetchError("Failed to fetch district data. Make sure district.json is in public folder.");
      });
  }, []);

  const getUpazilas = (districtId) => {
    const district = districts.find((d) => d.id === districtId);
    return district ? district.upazilas : [];
  };

  const [form, setForm] = useState({
    requesterName: user?.displayName || "",
    requesterEmail: user?.email || "",
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    address: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Blocked user check
  if (!userData || userData.status !== "active") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>
            Your account is blocked or inactive. You cannot create a donation
            request.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "recipientDistrict") {
        return {
          ...prev,
          recipientDistrict: value,
          recipientUpazila: "",
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await new Promise((res) => setTimeout(res, 1000)); 

      axiosSecure.post("/donationRequest", {
        ...form,
        requesterId: user?.uid,
        recipientDistrict: form.recipientDistrict,
        recipientUpazila: form.recipientUpazila,
        status: "pending",
      }
      )
      setSuccessMsg("Donation request created successfully!");
      setForm({
        requesterName: user?.displayName || "",
        requesterEmail: user?.email || "",
        recipientName: "",
        recipientDistrict: "",
        recipientUpazila: "",
        hospitalName: "",
        address: "",
        bloodGroup: "",
        donationDate: "",
        donationTime: "",
        requestMessage: "",
      });
    } catch (err) {
      setErrorMsg("Failed to create donation request. Try again.");
    }

    setLoading(false);
  };

  // Disable form if user is blocked
  const isBlocked = !userData || userData.status !== "active";

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Create Donation Request
      </h2>

      {fetchError && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {fetchError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Requester info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Requester Name</label>
            <input
              type="text"
              name="requesterName"
              value={form.requesterName}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
              disabled={isBlocked}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Requester Email</label>
            <input
              type="email"
              name="requesterEmail"
              value={form.requesterEmail}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
              disabled={isBlocked}
            />
          </div>
        </div>

        {/* Recipient Name */}
        <div>
          <label className="block font-medium mb-1">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            disabled={isBlocked}
          />
        </div>

        {/* District and Upazila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Recipient District</label>
            <select
              name="recipientDistrict"
              className="w-full px-3 py-2 border rounded"
              value={form.recipientDistrict}
              onChange={handleChange}
              required
              disabled={isBlocked}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Recipient Upazila</label>
            <select
              name="recipientUpazila"
              className="w-full px-3 py-2 border rounded"
              value={form.recipientUpazila}
              onChange={handleChange}
              required
              disabled={isBlocked}
            >
              <option value="">Select Upazila</option>
              {getUpazilas(form.recipientDistrict).map((upazila, idx) => (
                <option key={idx} value={upazila}>
                  {upazila}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital & Address */}
        <div>
          <label className="block font-medium mb-1">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            disabled={isBlocked}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Full Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            disabled={isBlocked}
          />
        </div>

        {/* Blood, Date, Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Blood Group</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
              disabled={isBlocked}
            >
              <option value="">Select group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Donation Date</label>
            <input
              type="date"
              name="donationDate"
              value={form.donationDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
              disabled={isBlocked}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Donation Time</label>
            <input
              type="time"
              name="donationTime"
              value={form.donationTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
              disabled={isBlocked}
            />
          </div>
        </div>

        {/* Request Message */}
        <div>
          <label className="block font-medium mb-1">Request Message</label>
          <textarea
            name="requestMessage"
            value={form.requestMessage}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded"
            placeholder="Explain your situation"
            disabled={isBlocked}
          />
        </div>

        {/* Status messages */}
        {successMsg && (
          <div className="text-green-600 font-medium">{successMsg}</div>
        )}
        {errorMsg && <div className="text-red-600 font-medium">{errorMsg}</div>}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || isBlocked}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Requesting..." : isBlocked ? "Request (Blocked)" : "Request"}
        </button>
      </form>
    </div>
  );
};

export default DonorCreateReq;
