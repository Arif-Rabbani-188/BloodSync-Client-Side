import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const events = [
  {
    id: 1,
    title: "Emergency Blood Drive at City Hospital",
    date: "July 20, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "City Hospital, Dhaka",
    image: "/donation1.jpg",
  },
  {
    id: 2,
    title: "Community Blood Donation Camp",
    date: "July 25, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Green Park Community Center",
    image: "/donation2.jpg",
  },
  {
    id: 3,
    title: "University Youth Blood Drive",
    date: "August 01, 2025",
    time: "11:00 AM - 5:00 PM",
    location: "Daffodil International University",
    image: "donation3.jpg",
  },
];

const BloodDonationCampaign = () => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => setIndex((prev) => (prev + 1) % events.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + events.length) % events.length);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const currentEvent = events[index];

return (
    <section className="py-16 px-4" style={{background:"var(--color-bg)", color:"var(--color-text)"}}>
        <div className="max-w-6xl mx-auto text-center mb-10">
            <h2 className="text-4xl font-bold text-red-600 mb-2">
                Upcoming Blood Donation Campaigns
            </h2>
            <p className="text-muted text-lg">
                Join one of our scheduled events and be a real-life hero.
            </p>
        </div>

        <div className=" w-11/12 mx-auto card overflow-hidden flex justify-center" style={{ width: "100%", height: "350px" }}>
            <div className="md:flex h-full">
                <img
                    src={currentEvent.image}
                    alt={currentEvent.title}
                    className="w-full md:w-1/2 h-72 md:h-full object-cover"
                    style={{ minWidth: "350px", maxWidth: "350px", minHeight: "350px", maxHeight: "350px" }}
                />
                <div className="p-6 text-left flex flex-col justify-between w-full h-full">
                    <div>
                        <h3 className="text-2xl font-bold text-red-700 mb-2">{currentEvent.title}</h3>
                        <div className="text-gray-600 mb-2 flex items-center gap-2">
                            <FaCalendarAlt className="text-red-500" />
                            {currentEvent.date}
                        </div>
                        <div className="text-gray-600 mb-2 flex items-center gap-2">
                            <FaClock className="text-red-500" />
                            {currentEvent.time}
                        </div>
                        <div className="text-gray-600 mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" />
                            {currentEvent.location}
                        </div>
                    </div>
                    <button className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full self-start">
                        Join Now
                    </button>
                </div>
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full shadow hover-surface border"
                style={{ background:"var(--color-surface)", borderColor:"var(--color-border)" }}
            >
                <FaArrowLeft />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full shadow hover-surface border"
                style={{ background:"var(--color-surface)", borderColor:"var(--color-border)" }}
            >
                <FaArrowRight />
            </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
            {events.map((_, i) => (
                <div
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${
                        index === i ? "bg-red-600" : "bg-gray-300"
                    }`}
                />
            ))}
        </div>
    </section>
);
};

export default BloodDonationCampaign;
