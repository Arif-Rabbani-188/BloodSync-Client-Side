import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
// import Logo from '../Logo/Logo';
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Logo from "../Logo/Logo";

const Navbar = () => {
  const { user, logOut, setUser, userData } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  // Derive initial theme synchronously from localStorage or existing html attribute
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      const attr = document.documentElement.getAttribute("data-theme");
      return attr === "dark" ? "dark" : "light"; // default light
    } catch {
      return "light";
    }
  }); // light | dark

  const handleMenuToggle = () => setMobileMenuOpen((prev) => !prev);

  const handleLogOut = () => {
    logOut();
    setProfileMenuOpen(false);
  };

  // Apply theme on change
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header>
      <nav className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-red-200 to-red-700 text-white shadow-md">
        <div className="mx-auto w-11/12 md:w-10/12 px-4 md:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Brand */}
            <Logo />

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center space-x-8">
              {/* Logged-out: 3 routes (excluding auth pages). Logged-in: 5 routes. */}
              <li>
                <NavLink to="/home" className="text-white/90 hover:text-white">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/donation-requests"
                  className="text-white/90 hover:text-white"
                >
                  Donation Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/search-donor"
                  className="text-white/90 hover:text-white"
                >
                  Search Donor
                </NavLink>
              </li>
              {user ? (
                <>
                  {/* Two more items to make total 5 for logged-in */}
                  <li>
                    <NavLink
                      to="/blogs"
                      className="text-white/90 hover:text-white"
                    >
                      Blogs
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="text-white/90 hover:text-white"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                </>
              ) : null}

              {/* Auth link (Login) when logged-out; not counted among 3 */}
              {!user && (
                <li>
                  <NavLink
                    to="/login"
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition"
                  >
                    Login
                  </NavLink>
                </li>
              )}

              {/* Theme toggle */}
              <li>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-2"
                  title={`Theme: ${theme}`}
                >
                  {theme === "dark" ? <span aria-hidden>🌙</span> : <span aria-hidden>☀️</span>}
                </button>
              </li>

              {/* Profile dropdown when logged-in */}
              {user && (
                <li className="relative">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={profileMenuOpen}
                  >
                    <div className="relative">
                      <img
                        src={
                          user?.photoURL || "https://ui-avatars.com/api/?name=User"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white/50 object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${
                          userData?.status === "active" ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={userData?.status === "active" ? "Active" : "Deactive"}
                      ></span>
                    </div>
                  </button>
                  {profileMenuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-80 rounded-lg shadow-lg z-50 py-4 px-5 border"
                      style={{ background: "var(--color-surface)", color: "var(--color-text)", borderColor: "var(--color-border)" }}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={user?.photoURL || "https://ui-avatars.com/api/?name=User"}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                        />
                        <div>
                          <div className="font-semibold text-base">
                            {user?.displayName || "User Name"}
                          </div>
                          <div className="text-xs text-gray-500">{user?.email}</div>
                          <div className="flex items-center mt-1 text-xs">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                userData?.status === "active" ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></span>
                            <span className="capitalize">{userData?.status || "unknown"}</span>
                          </div>
                          <span className="text-xs text-gray-600 capitalize">
                            Role: {userData?.role || "unknown"}
                          </span>
                        </div>
                      </div>

                      {/* Protected routes in dropdown */
                      }
                      <div className="space-y-2 mb-3">
                        <NavLink
                          to="/dashboard"
                          className="block py-2 px-3 rounded hover-surface"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Dashboard Home
                        </NavLink>
                        {/* Role-specific homes */}
                        {userData?.role === "admin" ? (
                          <NavLink
                            to="/dashboard/admin-home"
                            className="block py-2 px-3 rounded hover-surface"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            Admin Home
                          </NavLink>
                        ) : (
                          <NavLink
                            to="/dashboard/donor-home"
                            className="block py-2 px-3 rounded hover-surface"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            Donor Home
                          </NavLink>
                        )}
                        <NavLink
                          to="/dashboard/my-donation"
                          className="block py-2 px-3 rounded hover-surface"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          My Donation Requests
                        </NavLink>
                        <NavLink
                          to="/dashboard/create-donation"
                          className="block py-2 px-3 rounded hover-surface"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Create Donation Request
                        </NavLink>
                        {/* Always visible protected links */}
                        <NavLink
                          to="/funding"
                          className="block py-2 px-3 rounded hover-surface"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Funding
                        </NavLink>
                        <NavLink
                          to="/give-fund"
                          className="block py-2 px-3 rounded hover-surface"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Give Fund
                        </NavLink>
                        {/* Admin-only shortcuts */}
                        {userData?.role === "admin" && (
                          <>
                            <NavLink
                              to="/dashboard/all-users"
                              className="block py-2 px-3 rounded hover-surface"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              Manage Users
                            </NavLink>
                            <NavLink
                              to="/dashboard/all-donation-requests"
                              className="block py-2 px-3 rounded hover-surface"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              All Donation Requests
                            </NavLink>
                            <NavLink
                              to="/dashboard/content-management"
                              className="block py-2 px-3 rounded hover-surface"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              Content Management
                            </NavLink>
                            <NavLink
                              to="/dashboard/content-management/add-blog"
                              className="block py-2 px-3 rounded hover-surface"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              Add Blog
                            </NavLink>
                          </>
                        )}
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
              )}
            </ul>

            {/* Mobile theme toggle + hamburger */}
            <button
              onClick={toggleTheme}
              className="md:hidden mr-3 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Toggle theme"
              title={`Theme: ${theme}`}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-1 w-6 bg-white rounded transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-6 bg-white rounded my-1 transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-6 bg-white rounded transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <ul
          className={`md:hidden flex flex-col shadow-lg px-5 py-4 absolute left-0 right-0 transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          style={{ top: "64px", background: "var(--color-surface)", color: "var(--color-text)", borderTop: "1px solid var(--color-border)" }}
        >
          {/* Theme toggle in mobile menu */}
      <li className="mb-2">
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full py-2 px-3 rounded hover-surface text-left"
        title={`Theme: ${theme}`}
            >
        Theme: {theme === "dark" ? "Dark" : "Light"}
            </button>
          </li>
          {/* Profile section */}
          <div className="py-3">
            {user ? (
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={user?.photoURL || "https://ui-avatars.com/api/?name=User"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                />
                <div>
                  <div className="font-semibold text-base">
                    {user?.displayName || "User Name"}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <NavLink
                  to="/login"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>

          {/* Core links (3 public) */}
          <li>
            <NavLink
              to="/home"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/donation-requests"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Donation Requests
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search-donor"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Donor
            </NavLink>
          </li>

          {/* Extra links for logged-in to make total 5 */}
          {user && (
            <>
              <li>
                <NavLink
                  to="/blogs"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>

              {/* Protected shortcuts */}
              <hr className="my-2" />
              <li className="text-xs uppercase text-gray-500 px-1">Protected</li>
              {/* Role-specific homes */}
              {userData?.role === "admin" ? (
                <li>
                  <NavLink
                    to="/dashboard/admin-home"
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Home
                  </NavLink>
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/dashboard/donor-home"
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Donor Home
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/funding"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Funding
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/give-fund"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Give Fund
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/my-donation"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Donation Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/create-donation"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Donation Request
                </NavLink>
              </li>
              {userData?.role === "admin" && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/all-users"
                      className="block py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/all-donation-requests"
                      className="block py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Donation Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/content-management"
                      className="block py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Content Management
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/content-management/add-blog"
                      className="block py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Add Blog
                    </NavLink>
                  </li>
                </>
              )}

              <button
                onClick={() => {
                  handleLogOut();
                  setMobileMenuOpen(false);
                }}
                className="mt-3 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Log Out
              </button>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
