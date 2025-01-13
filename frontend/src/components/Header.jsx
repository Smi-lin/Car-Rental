import { Link} from "react-router-dom";
import { useState } from "react";
import { FaBars, FaMoon, FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCheckRenteeStatus } from '../hooks/useRenteeCheckStatus';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isRentee, isLoading } = useCheckRenteeStatus();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b-2 bg-white shadow-sm">
        <div className="w-full px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                CarHive
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>

            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-8">
            
                <Link
                  to="/aboutus"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors"
                >
                  About us
                </Link>
                <Link
                  to="/fleet"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors"
                >
                  Fleet
                </Link>
                <Link
                  to="/faq"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors"
                >
                  FAQ
                </Link>
                {!isLoading && isRentee && (
                  <Link
                    to="/rentee-dashboard"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </nav>

            {/* Right side buttons and search */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
              {!isLoading && !isRentee && (
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-black rounded-lg transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                )}
                <div>
                  {/* <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium shadow-md">
                  Connect Wallet
                </button> */}
                  <appkit-button />
                </div>
                <button
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Toggle theme"
                >
                  <FaMoon />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  About us
                </Link>
                <Link
                  to="/fleet"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  Fleet
                </Link>
                <Link
                  to="/faq"
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                >
                  FAQ
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-3"
                >
                  Sign Up
                </Link>
                <button className="w-full px-3 py-2 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 mx-3">
                  Connect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ToastContainer theme="dark" position="top-right" />
      {/* Spacer div to push content below fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;