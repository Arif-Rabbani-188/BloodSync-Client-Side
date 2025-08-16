import React, { use, useState } from "react";
import Logo from "../../../Components/Logo/Logo";
import { Link, NavLink } from "react-router";
import useUserRole from "../../../Hooks/useUserRole";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {userData} = use(AuthContext);

  const { role, isLoading } = useUserRole();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (!role && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Sidebar content for reuse
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-10 md:mt-10 lg:mt-0">
        <Logo />
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <NavLink
            onClick={toggleSidebar}
              to="/home"
              className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-7-7v10a1 1 0 01-1 1h-3"
                ></path>
              </svg>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
            onClick={toggleSidebar}
              to="/dashboard/overview"
              className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3v18m-7-7h18"/></svg>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink
            onClick={toggleSidebar}
              to="/dashboard/profile"
              className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Profile
            </NavLink>
          </li>
          <li>
            <Link
            onClick={toggleSidebar}
              to="/dashboard"
              className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7m-7-7v10a1 1 0 01-1 1h-3"
                ></path>
              </svg>
              Dashboard Home
            </Link>
            </li>
          {(role === "admin" || role === "volunteer") && !isLoading && (
            <li>
              <NavLink
              onClick={toggleSidebar}
                to="/dashboard/all-users"
                className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition duration-200"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                All Users
              </NavLink>
            </li>
          )}
          {( (role === "admin" || role === "volunteer") && !isLoading ) && (
            <li>
              <NavLink
              onClick={toggleSidebar}
                to="/dashboard/all-donation-requests"
                className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-yellow-100 hover:text-yellow-700 transition duration-200"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                All Blood Donation Request
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
            onClick={toggleSidebar}
              to="/dashboard/my-donation"
              className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-green-100 hover:text-green-700 transition duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
              My Donation Request
            </NavLink>
          </li>
          <li>
            <NavLink
            onClick={toggleSidebar}
              to="/dashboard/create-donation"
              className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 transition duration-200"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Create Donation Request
            </NavLink>
          </li>
          {(role === "admin" || role === "volunteer") && !isLoading && (
            <li>
              <NavLink
              onClick={toggleSidebar}
                to="/dashboard/content-management"
                className="flex items-center p-3 rounded-xl text-lg font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition duration-200"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
                Content Management
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-4 py-5">
          <div className="flex items-center">
            <Logo />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </nav>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
        )}
        <aside
          className={`fixed inset-0 left-0 z-50 w-full h-full bg-white shadow-lg flex flex-col p-6 font-sans
                        transform transition-transform duration-300 ease-in-out
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}
                        `}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <aside className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg flex flex-col p-6 font-sans z-50">
          {sidebarContent}
        </aside>
      </div>
    </>
  );
};

export default Aside;
