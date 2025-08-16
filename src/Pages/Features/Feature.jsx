import React from "react";
import { FaHandHoldingHeart, FaSearch, FaRegListAlt, FaTachometerAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaHandHoldingHeart className="text-red-600 text-4xl mb-3" />,
    title: "Easy Blood Donation",
    description: "Register and donate blood effortlessly with verified profiles and streamlined requests.",
  },
  {
    icon: <FaSearch className="text-red-600 text-4xl mb-3" />,
    title: "Find Donors Quickly",
    description: "Search by blood group, location, or availability to find the right donor in seconds.",
  },
  {
    icon: <FaRegListAlt className="text-red-600 text-4xl mb-3" />,
    title: "Request Management",
    description: "Create, manage, and track your blood requests from your dashboard in real-time.",
  },
  {
    icon: <FaTachometerAlt className="text-red-600 text-4xl mb-3" />,
    title: "Live Status Tracking",
    description: "Monitor request progress, confirmations, and donation completions seamlessly.",
  },
];

const Feature = () => {
  return (
    <section
      className="py-12 px-4"
      style={{
        background:
          'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(34,197,94,0.05)), var(--color-bg)'
      }}
    >
      <div className="w-11/12 md:w-10/12 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Why Choose BloodSync?</h2>
        <p className="text-muted mb-10 max-w-2xl mx-auto">
          BloodSync helps save lives by making blood donation accessible, fast, and reliable for everyone.
        </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-xl transition duration-300 text-center flex flex-col items-center min-h-[220px] justify-center"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
