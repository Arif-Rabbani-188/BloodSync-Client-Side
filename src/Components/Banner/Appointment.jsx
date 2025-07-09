import React from "react";

const Appointment = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    sweetAlert("Success", "Your appointment has been submitted!", "success").then(() => {
      // Reset form or redirect user
      e.target.reset() ;
    });
  };
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-tl-[200px] rounded-br-[200px] px-3 md:p-8 flex items-center justify-center font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 md:w-10/12 flex flex-col lg:flex-row gap-12">
        {/* Left Section: Helpful Information */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">Appointment</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            Good to know <br />
            <span className="text-green-700">helpful information</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Here are some tips to help you prepare for your blood donation
            appointment and ensure a smooth experience.
          </p>
          <ul className="space-y-6">
            {[
              "Maintain a healthy iron level by eating iron rich foods.",
              "Drink an extra 16 oz. of water prior to your donation.",
              "Avoid alcohol consumption before your blood donation.",
              "Finally, Try to get a good night sound sleep after donation.",
              "Remember to bring the donor card or national ID/Passport.",
            ].map((tip, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1">
                  <svg
                    className="w-6 h-6 text-green-600"
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
                </div>
                <p className="text-lg text-gray-700">{tip}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section: Appointment Form */}
        <div className="flex-1 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <div className="flex flex-col sm:flex-row gap-6">
              <input
                type="time"
                placeholder="Time"
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              />
              <input
                type="date"
                placeholder="Date"
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-4 rounded-xl flex items-center justify-center text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Appointment Submit
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
    </div>
  );
};

export default Appointment;
