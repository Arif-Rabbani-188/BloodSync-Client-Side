import React, { useContext } from "react";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900 mt-1 md:mt-0">{value || "N/A"}</span>
  </div>
);

const Profile = () => {
  const { user, userData } = useContext(AuthContext);

  return (
    <div className="p-4 md:ml-80 mt-20 md:mt-10 w-11/12 md:w-10/12 mx-auto">
      <div className="bg-white rounded-2xl shadow p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <img
            src={user?.photoURL || "https://ui-avatars.com/api/?name=User"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-red-100"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.displayName || userData?.name || "User"}
            </h1>
            <p className="text-gray-600">{user?.email || userData?.email}</p>
            <div className="mt-2 inline-flex items-center gap-2 text-sm">
              <span className={`px-2 py-1 rounded-full border ${userData?.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200" }`}>
                {userData?.status || "unknown"}
              </span>
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                {userData?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-red-700 mb-3">Personal Information</h2>
            <InfoRow label="Full Name" value={user?.displayName || userData?.name} />
            <InfoRow label="Email" value={user?.email || userData?.email} />
            <InfoRow label="Phone" value={userData?.phone} />
            <InfoRow label="Blood Group" value={userData?.bloodGroup} />
          </div>

          <div className="bg-green-50 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-green-700 mb-3">Address</h2>
            <InfoRow label="District" value={userData?.recipientDistrict || userData?.district} />
            <InfoRow label="Upazila" value={userData?.recipientUpazila || userData?.upazila} />
            <InfoRow label="Address" value={userData?.upazila + ", " + userData?.district} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
