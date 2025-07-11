import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { NavLink } from "react-router";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";

const Banner = () => {
  const {user} = useContext(AuthContext);
  return (
    <div className="hero pt-30 pb-10 bg-gradient-to-br from-green-100 to-white min-h-[600px] rounded-tl-[100px]">
      <div className="flex flex-col lg:flex-row-reverse w-11/12 mx-auto items-center justify-between">
        <img
          src="Blood_thumbnail.jpg"
          className=" border-l-10 border-b-10 border-red-600 rounded-tl-full rounded-tr-full rounded-br-full shadow-2xl flex-1"
        />
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
            {
              !user && (<NavLink to="/register" className="p-2 pl-5 rounded-tr-lg font-bold text-lg bg-white rounded-full shadow-2xl flex items-center gap-5">
            Join as a Donor{" "}
            <span className="p-2 bg-green-400 text-white rounded-tl-full rounded-bl-full rounded-br-full">
              <FaArrowRight />
            </span>
          </NavLink>)
            }
          <NavLink to="/search-donor" className="p-2 pl-5 rounded-tr-lg font-bold text-lg bg-white rounded-full shadow-2xl flex items-center gap-5">
            Search Donors{" "}
            <span className="p-2 bg-green-400 text-white rounded-tl-full rounded-bl-full rounded-br-full">
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
