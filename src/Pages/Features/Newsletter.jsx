import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    setSubmitted(true);
  };

  return (
    <section className="py-12 px-4">
  <div className="w-11/12 md:w-10/12 mx-auto bg-red-600 text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Subscribe to our newsletter</h2>
          <p className="text-white/80">Get updates on campaigns, stories, and ways to help.</p>
        </div>
        {submitted ? (
          <div className="text-lg font-semibold">Thanks for subscribing!</div>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 rounded-l-full w-full md:w-80"
              style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
              required
            />
            <button type="submit" className="bg-white text-red-700 px-6 py-3 rounded-r-full font-semibold">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
