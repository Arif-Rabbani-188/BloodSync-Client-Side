import React from "react";

const Stat = ({ value, label }) => (
  <div className="bg-white rounded-2xl shadow p-6 text-center">
    <div className="text-3xl md:text-4xl font-extrabold text-red-600">{value}</div>
    <div className="mt-2 text-gray-600">{label}</div>
  </div>
);

const Stats = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-red-50 to-white">
      <div className="w-11/12 md:w-10/12 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-6">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Stat value="10k+" label="Lives Saved" />
          <Stat value="5k+" label="Active Donors" />
          <Stat value="2k+" label="Requests Fulfilled" />
          <Stat value="50+" label="Cities Covered" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
