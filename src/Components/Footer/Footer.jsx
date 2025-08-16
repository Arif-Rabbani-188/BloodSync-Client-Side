import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer
      className="pt-10 pb-6 shadow-inner mt-16 border-t"
      style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(34,197,94,0.05)), var(--color-bg)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
    >
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo and About */}
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-start text-muted">
            BloodSync is a platform that connects blood donors and recipients, promotes community support, and saves lives with every drop.
          </p>
          
        </div>

        {/* Location and Contact */}
        <div className="space-y-4 text-sm">
          <h3 className="text-lg text-start font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Contact Us</h3>
          <div className="flex items-center justify-start gap-2">
            <FaPhoneAlt style={{ color: 'var(--color-primary)' }} /> <span>+880 1884481000</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <FaEnvelope style={{ color: 'var(--color-primary)' }} /> <span>arif.rabbani.dev@gmail.com</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <FaMapMarkerAlt style={{ color: 'var(--color-primary)' }} /> <span>Dhaka, Bangladesh</span>
          </div>
        </div>

        {/* Highlight / Call to Action */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-start mb-2" style={{ color: 'var(--color-primary)' }}>Follow us</h3>
          <div className="flex justify-start gap-4 mt-4" style={{ color: 'var(--color-primary)' }}>
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
  <div className="mt-8 border-t pt-4 text-center text-xs text-muted" style={{ borderColor: 'var(--color-border)' }}>
        &copy; {new Date().getFullYear()} BloodSync. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
