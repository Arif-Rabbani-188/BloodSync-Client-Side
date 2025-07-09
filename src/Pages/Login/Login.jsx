import React, { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";

const Login = () => {
  const { signInWithEmail } = use(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    signInWithEmail(formData.email, formData.password)
    .then(() => {
      Swal.fire({
        title: "Login Successful",
        icon: "success",
        draggable: false,
      });
        navigate(location?.state || "/", { replace: true });
    })
    .catch((error) => {
      console.error("Login Error:", error);
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8 flex items-center justify-center font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-md w-full flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-center mb-4">
          Welcome to <span className="text-red-700">BloodSync</span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-4 rounded-xl flex items-center justify-center text-lg font-semibold hover:bg-red-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Login
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

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 hover:underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
