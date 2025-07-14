import React, { useState } from "react";
import Swal from "sweetalert2";

const Appointment = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      Swal.fire("Success", "Your message has been sent!", "success");
      e.target.reset();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-tl-[200px] rounded-br-[200px] px-3 md:p-8 flex items-center justify-center font-sans relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="loader border-8 border-t-8 border-gray-200 h-20 w-20 rounded-full"></div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 md:w-10/12 flex flex-col lg:flex-row gap-12">
        {/* Left Section */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Reach out <br />
            <span className="text-green-700">we're here to help</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Have questions or feedback? Send us a message and we’ll get back to you shortly.
          </p>
          <ul className="space-y-4 text-gray-700">
            <li>Email: arif.rabbani.dev@gmail.com</li>
            <li>Phone: +880 1884-481000</li>
            <li>Address: Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Right Section - Contact Form */}
        <div className="flex-1 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              className="input-style"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="input-style"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="input-style"
              required
            />
            <textarea
              placeholder="Your Message"
              className="input-style h-32 resize-none"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-4 rounded-xl flex items-center justify-center text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Send Message
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
      </div>

      <style>{`
        .loader {
          border-top-color: #22c55e;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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
          border-color: #22c55e;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Appointment;
