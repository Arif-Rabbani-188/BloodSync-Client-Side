import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const Register = () => {
  const { user, createUserWithEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    bloodGroup: "",
    selectedDistrict: "",
    selectedUpazila: "",
    password: "",
    confirmPassword: "",
  });
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch("distric.json")
      .then((response) => response.json())
      .then((data) => {
        setDistricts(data);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            icon: "error",
            title: "Failed to load districts",
            text: "Please try again later.",
          });
        });
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getUpazilas = (districtId) => {
    const district = districts.find((d) => d.id === districtId);
    return district ? district.upazilas : [];
  };

  const ImgUpload = () => {
    const [uploading, setUploading] = useState(false); // New uploading state

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true); // Start loading

      const formDataImg = new FormData();
      formDataImg.append("image", file);

      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey) {
        console.error("IMGBB API key is missing. Set VITE_IMGBB_API_KEY in your .env file.");
        setUploading(false);
        return;
      }

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          formDataImg
        );
        const url = response.data.data.display_url;
        setFormData((prevData) => ({
          ...prevData,
          photoURL: url,
        }));
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setUploading(false); // Stop loading
      }
    };

    return (
      <div className="p-2 border border-gray-200 rounded-xl">
        <label
          htmlFor="avatar-upload"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Upload Avatar
        </label>
        <input
          id="avatar-upload"
          type="file"
          onChange={handleImageUpload}
          className="w-full text-gray-700 p-2 btn bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          accept="image/*"
        />

        {/* Loading text */}
        {uploading && (
          <p className="text-blue-500 text-sm mt-2 text-center">
            Uploading image...
          </p>
        )}

        {/* Show uploaded image */}
        {formData.photoURL && !uploading && (
          <div className="mt-4 flex justify-center">
            <img
              src={formData.photoURL}
              alt="Uploaded Avatar"
              className="w-32 h-32 object-cover rounded-full border-2 border-blue-300 shadow-md"
            />
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords do not match!" });
      return;
    }

    setLoading(true);

    try {
      const selectedDistrictObj = districts.find(
        (d) => d.id === formData.selectedDistrict
      );
      const districtName = selectedDistrictObj
        ? selectedDistrictObj.name.charAt(0).toUpperCase() +
          selectedDistrictObj.name.slice(1)
        : formData.selectedDistrict;

      const userData = {
        name: formData.name,
        email: formData.email.toLowerCase(),
        photoURL: formData.photoURL,
        bloodGroup: formData.bloodGroup,
        district: districtName,
        upazila: formData.selectedUpazila,
        status: "active",
        role: "donor",
        createdAt: new Date().toISOString(),
      };

      // Create user with email
      await createUserWithEmail(
        formData.email,
        formData.password,
        formData.photoURL,
        formData.name
      );

      // Save user to database
      await axios.post(
        "https://blood-sync-server-side.vercel.app/users",
        userData
      );

      Swal.fire({
        icon: "success",
        title: "Registration successful!",
        text: "Welcome to BloodSync!",
      }).then(() => {
        navigate("/home");
        window.location.reload();
      });

      setFormData({
        name: "",
        email: "",
        photoURL: "",
        bloodGroup: "",
        selectedDistrict: "",
        selectedUpazila: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message || "Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-30 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center font-sans relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-xl w-full flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center mb-4">
          Register for <span className="text-blue-700">Account</span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input-style"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input-style"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <ImgUpload />

          <select
            name="bloodGroup"
            className="input-style bg-white"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>

          <select
            name="selectedDistrict"
            className="input-style bg-white"
            value={formData.selectedDistrict}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                selectedDistrict: e.target.value,
                selectedUpazila: "",
              }))
            }
            required
          >
            <option value="" disabled>
              Select District
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            name="selectedUpazila"
            className="input-style bg-white"
            value={formData.selectedUpazila}
            onChange={handleInputChange}
            disabled={!formData.selectedDistrict}
            required
          >
            <option value="" disabled>
              Select Upazila
            </option>
            {getUpazilas(formData.selectedDistrict).map((u, i) => (
              <option key={i} value={u}>
                {u}
              </option>
            ))}
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-style"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input-style"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-xl flex items-center justify-center text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
            <svg
              className="w-6 h-6 ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </button>
        </form>
      </div>

      {/* Loader Spinner Style */}
      <style>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .input-style {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          transition: border-color 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Register;
