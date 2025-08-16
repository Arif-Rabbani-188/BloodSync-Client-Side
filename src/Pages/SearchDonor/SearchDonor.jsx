import React, { useEffect, useState } from "react";
import useUsers from "../../Hooks/useUsers";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const SearchDonor = () => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [districtIdToName, setDistrictIdToName] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axios
      .get("/distric.json")
      .then((response) => {
        // Use district display names directly
        setDistricts(response.data.map((d) => d.name));
        const upazilaMap = {};
        const idMap = {};
        response.data.forEach((d) => {
          upazilaMap[d.name] = d.upazilas;
          if (d.id) idMap[d.id.toString().trim().toLowerCase()] = d.name;
        });
        setUpazilas(upazilaMap);
        setDistrictIdToName(idMap);
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
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const norm = (v) => (v ?? "").toString().trim().toLowerCase();
    const districtSynonyms = {
      // common legacy/new names and spellings
      "chittagong": "Chattogram",
      "chattagram": "Chattogram",
      "jessore": "Jashore",
      "jashore": "Jashore",
      "barisal": "Barisal", // some use Barishal; JSON uses Barisal
      "barishal": "Barisal",
      "comilla": "Comilla",
      "cumilla": "Cumilla",
      "bogra": "Bogura",
      "bogura": "Bogura",
    };
    const canonicalDistrict = (raw) => {
      const val = (raw ?? "").toString().trim();
      if (!val) return "";
      const key = val.toLowerCase();
      // If matches an ID in map, return its display name
      if (districtIdToName[key]) return districtIdToName[key];
      // If matches a known synonym, return canonical display name
      if (districtSynonyms[key]) return districtSynonyms[key];
      // Otherwise return as-is
      return val;
    };

    // First try server-side query, then fall back to local cache filtering
    let serverUsers = null;
    setSearching(true);
    try {
      const res = await axiosSecure.get('/users', {
        params: {
          bloodGroup: form.bloodGroup,
          district: form.district,
          upazila: form.upazila,
          role: 'donor',
          status: 'active',
        },
      });
      serverUsers = Array.isArray(res.data) ? res.data : null;
    } catch (err) {
      // ignore and use local fallback
      serverUsers = null;
    }

    const source = Array.isArray(serverUsers) && serverUsers.length > 0 ? serverUsers : users;

    const exact = source.filter((user) => {
      const userBG = norm(user.bloodGroup || user.blood_group || user.bloodgroup);
      const userDistrictName = canonicalDistrict(
        user.district || user.recipientDistrict || user.selectedDistrict
      );
      const userDistrict = norm(userDistrictName);
      const userUpazila = norm(
        user.upazila || user.recipientUpazila || user.selectedUpazila || user.upozila
      );
      const isActiveDonor = (user.role || "").toLowerCase() === "donor" && (user.status || "").toLowerCase() === "active";
      return (
        isActiveDonor &&
        userBG === norm(form.bloodGroup) &&
        userDistrict === norm(canonicalDistrict(form.district)) &&
        userUpazila === norm(form.upazila)
      );
    });
    if (exact.length > 0) {
  setFiltered(exact);
  setSearching(false);
  return;
    }

    // Fallback: fuzzy contains for district/upazila to handle minor naming differences like "Dhaka" vs "Dhaka Sadar"
  const fuzzy = source.filter((user) => {
      const userBG = norm(user.bloodGroup || user.blood_group || user.bloodgroup);
      const userDistrict = norm(
        canonicalDistrict(user.district || user.recipientDistrict || user.selectedDistrict)
      );
      const userUpazila = norm(
        user.upazila || user.recipientUpazila || user.selectedUpazila || user.upozila
      );
      const isActiveDonor = (user.role || "").toLowerCase() === "donor" && (user.status || "").toLowerCase() === "active";
      const wantBG = norm(form.bloodGroup);
      const wantDistrict = norm(canonicalDistrict(form.district));
      const wantUpazila = norm(form.upazila);
      const districtMatches = userDistrict === wantDistrict || userDistrict.includes(wantDistrict) || wantDistrict.includes(userDistrict);
      const upazilaMatches = userUpazila === wantUpazila || userUpazila.includes(wantUpazila) || wantUpazila.includes(userUpazila);
      return isActiveDonor && userBG === wantBG && districtMatches && upazilaMatches;
    });
  setFiltered(fuzzy);
  setSearching(false);
  };

  return (
    <div className="max-w-lg mt-30 mx-auto p-8 rounded-xl shadow-lg" style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
      <h2 className="text-center text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>
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
            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-400"
            style={{ background: "var(--color-surface)", color: "var(--color-text)", borderColor: "var(--color-border)" }}
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
            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-400"
            style={{ background: "var(--color-surface)", color: "var(--color-text)", borderColor: "var(--color-border)" }}
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
            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-400 ${
              !form.district ? "opacity-60 cursor-not-allowed" : ""
            }`}
            style={{ background: "var(--color-surface)", color: "var(--color-text)", borderColor: "var(--color-border)" }}
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
          className="w-full py-3 rounded-md btn btn-primary text-lg"
        >
          Search
        </button>
      </form>

      {filtered && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-center mt-4 text-muted">No donors found.</p>
          ) : (
            <ul className="space-y-4">
        {filtered.map((donor) => (
                <li
          key={donor._id || donor.id || donor.email}
                  className="p-4 rounded-lg shadow flex flex-col gap-1"
                  style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
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
