import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";

const Login = () => {
  const { signInWithEmail } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

    setLoading(true);

    signInWithEmail(formData.email, formData.password)
      .then(() => {
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          draggable: false,
        }).then(() => {
          navigate(location?.state?.from || "/", { replace: true });
        });      })
      .catch((error) => {
        console.error("Login Error:", error);
        Swal.fire({
          title: "Login Failed",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8 flex items-center justify-center font-sans relative">
      {loading && (
  <div className="absolute inset-0 flex items-center justify-center z-50" style={{background:"var(--color-surface)", opacity:0.6}}>
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
        </div>
      )}

  <div className="card rounded-3xl p-8 md:p-12 lg:p-16 max-w-md w-full flex flex-col gap-8">
  <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center mb-4">
          Welcome to <span className="text-red-700">BloodSync</span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input-style"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-style"
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
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-green-600 hover:underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>

      {/* Loader Spinner Style */}
      <style>{`
        .loader {
          border-top-color: #e3342f;
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
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Login;
