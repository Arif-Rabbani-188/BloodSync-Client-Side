import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-red-50 to-green-100 text-gray-800 pt-10 pb-6 shadow-inner mt-16 border-t">
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and About */}
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-start text-gray-600">
            BloodSync is a platform that connects blood donors and recipients, promotes community support, and saves lives with every drop.
          </p>
          
        </div>

        {/* Location and Contact */}
        <div className="space-y-4 text-sm">
          <h3 className="text-lg text-start font-semibold text-red-700 mb-2">Contact Us</h3>
          <div className="flex items-center justify-start gap-2">
            <FaPhoneAlt className="text-red-500" /> <span>+880 1884481000</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <FaEnvelope className="text-red-500" /> <span>arif.rabbani.dev@gmail.com</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <FaMapMarkerAlt className="text-red-500" /> <span>Dhaka, Bangladesh</span>
          </div>
        </div>

        {/* Highlight / Call to Action */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-start text-red-700 mb-2">Follow us</h3>
          <div className="flex justify-start gap-4 text-red-600 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF className="hover:text-red-700 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="hover:text-red-700 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="hover:text-red-700 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} BloodSync. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
