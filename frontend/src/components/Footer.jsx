import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <Link to="/" className="text-2xl font-bold block mt-6 mb-4">
              CarHive
            </Link>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">About Us</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/mission" className="text-gray-600 hover:text-black">
                  Mission
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-black">
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/newsletter"
                  className="text-gray-600 hover:text-black"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-black">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-600 hover:text-black"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-black">
                  FAQ's
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-lg mb-4">Social</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com"
                  className="text-gray-600 hover:text-black flex items-center gap-2"
                >
                  <FaInstagram /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  className="text-gray-600 hover:text-black flex items-center gap-2"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  className="text-gray-600 hover:text-black flex items-center gap-2"
                >
                  <FaYoutube /> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 mt-12 border-t border-gray-200 text-sm text-gray-600">
          <div>Copyright © {new Date().getFullYear()} CarHive</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-black">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-black">
              Privacy Policy
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-black flex items-center gap-1"
            >
              Back to top
              <span className="rotate-45 inline-block">→</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
