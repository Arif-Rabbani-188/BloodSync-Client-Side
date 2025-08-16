import React from "react";

const Stat = ({ value, label }) => (
  <div className="card p-6 text-center">
    <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--color-primary)' }}>{value}</div>
    <div className="mt-2 text-muted">{label}</div>
  </div>
);

const Stats = () => {
  return (
    <section
      className="py-12 px-4"
      style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(34,197,94,0.05)), var(--color-bg)'
      }}
    >
      <div className="w-11/12 md:w-10/12 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Our Impact</h2>
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
