import React, { useEffect, useState } from "react";
import useUsers from "../../Hooks/useUsers";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SearchDonor = () => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axios
      .get("distric.json")
      .then((response) => {
        setDistricts(response.data.map((d) => d.name));
        const upazilaMap = {};
        response.data.forEach((d) => {
          upazilaMap[d.name] = d.upazilas;
        });
        setUpazilas(upazilaMap);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  }, []);
  const { data: users = [] } = useUsers();
  const [form, setForm] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  const [filtered, setFiltered] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const result = users.filter(
      (user) =>
        user.bloodGroup === form.bloodGroup &&
        user.district === form.district &&
        user.upazila === form.upazila
    );
    setFiltered(result);
  };

  return (
    <div className="max-w-lg mt-30 mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-center text-2xl font-bold text-red-600 mb-6">
        Search Blood Donor
      </h2>
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block font-semibold mb-1">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">District</label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Upazila</label>
          <select
            name="upazila"
            value={form.upazila}
            onChange={handleChange}
            required
            disabled={!form.district}
            className={`w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 ${
              !form.district ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          >
            <option value="">Select Upazila</option>
            {form.district &&
              upazilas[form.district]?.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-red-600 text-white font-bold text-lg hover:bg-red-800 transition-colors"
        >
          Search
        </button>
      </form>

      {filtered && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No donors found.</p>
          ) : (
            <ul className="space-y-4">
              {filtered.map((donor) => (
                <li
                  key={donor.id}
                  className="bg-gray-100 p-4 rounded-lg shadow flex flex-col gap-1"
                >
                  <span>
                    <span className="font-semibold">Name:</span> {donor.name}
                  </span>
                  <span>
                    <span className="font-semibold">Email:</span> {donor.email}
                  </span>
                  <span>
                    <span className="font-semibold">Blood Group:</span>{" "}
                    {donor.bloodGroup}
                  </span>
                  <span>
                    <span className="font-semibold">Location:</span>{" "}
                    {donor.district}, {donor.upazila}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDonor;
