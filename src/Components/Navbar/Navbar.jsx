import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
// import Logo from '../Logo/Logo';
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Logo from "../Logo/Logo";
import axios from "axios";

const Navbar = () => {
  const { user, logOut, setUser, userData } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleMenuToggle = () => setMobileMenuOpen((prev) => !prev);

  const handleLogOut = () => {
    logOut();
    setProfileMenuOpen(false);
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <nav className="p-4 w-full md:w-10/12 px-10 bg-white shadow-md md:rounded-full md:mt-5 fixed top-0 z-50">
          <div className="mx-auto flex justify-between items-center">
            {/* Desktop Menu */}
            <div className="flex items-center justify-between w-full">
              <Logo></Logo>
              <ul className="hidden md:flex space-x-8 items-center">
                <li>
                  <NavLink
                    to="/home"
                    className="text-black hover:text-gray-700"
                  >
                    Home
                  </NavLink>
                </li>
                {user ? (
                  <>
                    <li>
                      <NavLink
                        to="/dashboard"
                        className="text-black hover:text-gray-700"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                  </>
                ) : null}
                <li>
                  <NavLink
                    to="/donation-requests"
                    className="text-black hover:text-gray-700"
                  >
                    Donation Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/search-donor"
                    className="text-black hover:text-gray-700"
                  >
                    Search Donor
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blog"
                    className="text-black hover:text-gray-700"
                  >
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/funding"
                    className="text-black hover:text-gray-700"
                  >
                    Funding
                  </NavLink>
                </li>
                {user ? (
                  <li className="relative">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                    >
                      <div className="relative">
                        <img
                          src={
                            user?.photoURL ||
                            "https://ui-avatars.com/api/?name=User"
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                        />
                        {/* Status Dot */}
                        <span
                          className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${
                            userData?.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          title={
                            userData?.status === "active"
                              ? "Active"
                              : "Deactive"
                          }
                        ></span>
                      </div>
                    </button>
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-6 w-90 bg-white rounded-lg shadow-lg z-50 py-4 px-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={
                              user?.photoURL ||
                              "https://ui-avatars.com/api/?name=User"
                            }
                            alt="Profile"
                            className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover"
                          />
                          <div>
                            <div className="font-semibold text-lg">
                              {user?.displayName || "User Name"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email || "user@email.com"}
                            </div>
                            <div className="flex items-center mt-1">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  userData?.status === "active"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              <span className="text-xs text-gray-600 capitalize">
                                {userData?.status || "unknown"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600 capitalize">
                              Role: {userData?.role || "unknown"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleLogOut}
                          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                          Log Out
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className="text-black hover:text-gray-700"
                    >
                      Login
                    </NavLink>
                  </li>
                )}
              </ul>
              <button
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
                onClick={handleMenuToggle}
                aria-label="Toggle menu"
              >
                <span
                  className={`block h-1 w-6 bg-black rounded transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-1 w-6 bg-black rounded my-1 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block h-1 w-6 bg-black rounded transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>
            </div>
            {/* Mobile Menu */}
            <ul
              className={`md:hidden flex flex-col w-full bg-white rounded-xl shadow-lg mt-4 px-6 py-4 absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out
                            ${
                              mobileMenuOpen
                                ? "opacity-100 scale-100 pointer-events-auto"
                                : "opacity-0 scale-95 pointer-events-none"
                            }`}
              style={{ top: "49px" }}
            >
              <hr />
              <div className=" bg-white rounded-lg  z-50 py-4">
                <div className="items-center space-x-4 mb-4 flex flex-col justify-center">
                  <img
                    src={
                      user?.photoURL || "https://ui-avatars.com/api/?name=User"
                    }
                    alt="Profile"
                    className="w-30 h-30 rounded-full border-2 border-gray-300 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">
                      {user?.displayName || "User Name"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user?.email || "user@email.com"}
                    </div>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          userData?.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-xs text-gray-600 capitalize">
                        {userData?.status || "unknown"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 capitalize">
                      Role: {userData?.role || "unknown"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogOut}
                  className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Log Out
                </button>
              </div>
              <hr />
              <li>
                <NavLink
                  to="/home"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/donation-requests"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Donation Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/search-donor"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Donor
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/funding"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Funding
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="block py-2 text-black hover:text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
