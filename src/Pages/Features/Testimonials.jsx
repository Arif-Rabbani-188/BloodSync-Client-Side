import React from "react";

const testimonials = [
  {
    id: 1,
    name: "Ayesha",
    role: "Recipient",
    text: "BloodSync connected me with a donor in hours. I'm grateful for this platform.",
  },
  {
    id: 2,
    name: "Imran",
    role: "Donor",
    text: "The process was smooth, and I loved seeing the impact firsthand.",
  },
  {
    id: 3,
    name: "Nadia",
    role: "Donor",
    text: "Great cause and a great platform to help people in need.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-white to-red-50">
      <div className="w-11/12 md:w-10/12 mx-auto">
        <h2 className="text-3xl font-bold text-red-700 mb-2">What People Say</h2>
        <p className="text-gray-600 mb-8">Stories from our donors and recipients.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[200px]">
              <p className="text-gray-700 mb-4">“{t.text}”</p>
              <div className="text-sm text-gray-600">
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
