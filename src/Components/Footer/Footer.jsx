import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Logo from '../Logo/Logo';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-green-100 via-green-200 to-green-300 text-gray-800 py-10 mt-8 shadow-inner">
            <div className="w-11/12 mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                {/* Brand & Description */}
                <div className='flex flex-col items-center md:items-start gap-3'>
                    <Logo></Logo>
                    <p className="mb-4 text-base opacity-95">
                        Connecting donors and recipients, saving lives together.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4 mb-2">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>
                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold mb-3 text-lg text-red-700">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/about" className="hover:underline">About Us</a></li>
                        <li><a href="/donate" className="hover:underline">Donate Blood</a></li>
                        <li><a href="/request" className="hover:underline">Request Blood</a></li>
                        <li><a href="/faq" className="hover:underline">FAQ</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </div>
                {/* Resources */}
                <div>
                    <h3 className="font-semibold mb-3 text-lg text-red-700">Resources</h3>
                    <ul className="space-y-2">
                        <li><a href="/blog" className="hover:underline">Blog</a></li>
                        <li><a href="/events" className="hover:underline">Events</a></li>
                        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>
                {/* Contact Info */}
                <div>
                    <h3 className="font-semibold mb-3 text-lg text-red-700">Contact Us</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <FaPhoneAlt /> <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <FaEnvelope /> <span>support@bloodsync.com</span>
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-2">
                            <FaMapMarkerAlt /> <span>123 Main St, City, Country</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-green-400/20 mt-8 pt-4 text-center text-sm opacity-80">
                &copy; {new Date().getFullYear()} BloodSync. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;