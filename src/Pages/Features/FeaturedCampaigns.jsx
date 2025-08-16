import React from "react";

const items = [
  {
    id: 1,
    title: "City Hospital Drive",
    description: "Join the emergency drive at City Hospital to support critical patients.",
    image: "/donation1.jpg",
    link: "/donation-requests",
  },
  {
    id: 2,
    title: "Community Center Camp",
    description: "Be part of our community camp and donate to save a life.",
    image: "/donation2.jpg",
    link: "/donation-requests",
  },
  {
    id: 3,
    title: "University Youth Drive",
    description: "Encourage youth to donate and become real-life heroes.",
    image: "/donation3.jpg",
    link: "/donation-requests",
  },
];

const FeaturedCampaigns = () => {
  return (
    <section className="py-12 px-4">
      <div className="w-11/12 md:w-10/12 mx-auto">
        <h2 className="text-3xl font-bold text-red-700 mb-2">Featured Campaigns</h2>
        <p className="text-gray-600 mb-8">Discover highlighted donation events near you.</p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
      <div key={item.id} className="card flex flex-col overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-muted mb-4 flex-1">{item.description}</p>
                <a href={item.link} className="inline-block self-start bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-full">See more</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
