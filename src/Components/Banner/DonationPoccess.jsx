import React from "react";
import { FaRegClipboard, FaSearch, FaHandHoldingHeart, FaGlassCheers } from "react-icons/fa";

const DonationPoccess = () => {
const processData = [
    {
        id: 1,
        title: "Registration",
        description:
            "Register on our platform to become a donor or recipient. Fill out the necessary information to create your profile.",
        icon: <FaRegClipboard />,
    },
    {
        id: 2,
        title: "Screening",
        description:
            " We will screen your profile to ensure you meet the eligibility criteria for blood donation. This includes checking your health status and blood type.",
        icon: <FaSearch />,
    },
    {
        id: 3,
        title: "Donation",
        description:
            "Once your profile is approved, you will be matched with a recipient in need of blood. Our team will notify you about the match and provide details.",
        icon: <FaHandHoldingHeart />,
    },
    {
        id: 4,
        title: "Refreshments",
        description:
            "After donating blood, you will be provided with refreshments to help you recover. Your health and well-being are our priority.",
        icon: <FaGlassCheers />,
    },
];
return (
    <div className="md:px-30 py-10 px-4">
        <h1 className="text-3xl font-extrabold text-red-700 mb-2  drop-shadow">Donation Process</h1>
        <p className="text-gray-600 mb-8">
            We have been saving lives for 10 years. Join our mission to connect
            donors and recipients through our trusted platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processData.map((process) => (
                <div
                    key={process.id}
                    className="bg-white rounded-xl shadow-lg border-t-4 border-red-600 hover:border-green-500 transition-all duration-300 flex flex-col items-center p-6 hover:scale-105"
                >
                    <span className="text-4xl mb-4 bg-red-100 rounded-full p-4 border-2 border-green-400 shadow">{process.icon}</span>
                    <h2 className="text-lg font-bold text-green-700 mb-2">{process.title}</h2>
                    <p className="text-gray-700 text-center">{process.description}</p>
                </div>
            ))}
        </div>
    </div>
);
};

export default DonationPoccess;
