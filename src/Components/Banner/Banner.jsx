import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { NavLink } from "react-router";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";

const Banner = () => {
  const {user} = useContext(AuthContext);
  return (
    <div
      className="hero pt-30 pb-10 min-h-[600px] rounded-tl-[100px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(220,38,38,0.08)), var(--color-bg)",
      }}
    >
      <div className="flex flex-col lg:flex-row-reverse w-11/12 mx-auto items-center justify-between">
        <div className="flex-1 w-full flex items-center justify-center">
          <img
            src="Blood_thumbnail.jpg"
            alt="Hero"
            className="rounded-tl-full rounded-tr-full rounded-br-full shadow-2xl border-l-10 border-b-10 border-red-600 object-cover"
            style={{ width: "100%", maxWidth: 520, height: 360 }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center items-start px-2 pt-10 md:p-10">
          <h1 className="text-3xl md:text-5xl font-bold">
            Donate Blood <br /> save life!
          </h1>
          <p className="py-6">
            BloodSync is a platform that connects blood donors with those in
            need, ensuring that every drop counts. Join us in our mission to
            save lives by donating blood and helping those in critical need.
            Your contribution can make a difference!
          </p>
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            {!user && (
              <NavLink to="/register" className="btn btn-primary">
                Join as a Donor
                <span className="p-2 text-white rounded-full" style={{background:"var(--color-accent)"}}>
                  <FaArrowRight />
                </span>
              </NavLink>
            )}
            <NavLink to="/search-donor" className="btn btn-outline">
              Search Donors
              <span className="p-2 text-white rounded-full" style={{background:"var(--color-accent)"}}>
                <FaSearch />
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
