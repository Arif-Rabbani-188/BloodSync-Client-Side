import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import Logo from '../Logo/Logo';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => setMenuOpen((prev) => !prev);

    return (
        <div>
            <div className='flex justify-center items-center'>
                <nav className="p-4 w-full md:w-10/12 px-10 bg-white shadow-md md:rounded-full md:mt-5 fixed top-0 z-50">
                    <div className="mx-auto flex justify-between items-center">
                        <Logo></Logo>
                        {/* Hamburger Icon */}
                        <button
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
                            onClick={handleMenuToggle}
                            aria-label="Toggle menu"
                        >
                            <span className={`block h-1 w-6 bg-black rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block h-1 w-6 bg-black rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block h-1 w-6 bg-black rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </button>
                        {/* Desktop Menu */}
                        <ul className="hidden md:flex space-x-8">
                            <li>
                                <NavLink to="/home" className="text-black hover:text-gray-700">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/donation-requests" className="text-black hover:text-gray-700">Donation Requests</NavLink>
                            </li>
                            <li>
                                <NavLink to="/blog" className="text-black hover:text-gray-700">Blog</NavLink>
                            </li>
                            <li>
                                <NavLink to="/funding" className="text-black hover:text-gray-700">Funding</NavLink>
                            </li>
                            <li>
                                <NavLink to="/login" className="text-black hover:text-gray-700">Login</NavLink>
                            </li>
                        </ul>
                    </div>
                    {/* Mobile Dropdown Menu */}
                    <ul
                        className={`md:hidden flex flex-col w-full bg-white rounded-xl shadow-lg mt-4 px-6 py-4 absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out
                        ${menuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                        style={{ top: '49px' }}
                    >
                        <li>
                            <NavLink to="/home" className="block py-2 text-black hover:text-gray-700" onClick={() => setMenuOpen(false)}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className="block py-2 text-black hover:text-gray-700" onClick={() => setMenuOpen(false)}>About</NavLink>
                        </li>
                        <li>
                            <NavLink to="/complaint" className="block py-2 text-black hover:text-gray-700" onClick={() => setMenuOpen(false)}>Complaint</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" className="block py-2 text-black hover:text-gray-700" onClick={() => setMenuOpen(false)}>Contact</NavLink>
                        </li>
                        <li>
                            <NavLink to="/blog" className="block py-2 text-black hover:text-gray-700" onClick={() => setMenuOpen(false)}>Blog</NavLink>
                        </li>
                        <li>
                            <NavLink to="/login" className="block py-2 text-black hover:text-gray-700" onClick={() => setMenuOpen(false)}>Login</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;