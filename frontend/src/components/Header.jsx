import { Link} from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaMoon, FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCheckRenteeStatus } from '../hooks/useRenteeCheckStatus';
import { useCheckCarOwnerStatus } from '../hooks/useCarOwnerCheckStatus';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isRentee, isLoading: renteeLoading } = useCheckRenteeStatus();
  const { isCarOwner, loading: ownerLoading } = useCheckCarOwnerStatus();

  // Debug logging
  useEffect(() => {
    console.log("Auth Status:", {
      isRentee,
      isCarOwner,
      renteeLoading,
      ownerLoading
    });
  }, [isRentee, isCarOwner, renteeLoading, ownerLoading]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Dashboard link component to handle conditional rendering
  const DashboardLink = () => {
    // Debug logging
    useEffect(() => {
      console.log("DashboardLink Render:", {
        isRentee,
        isCarOwner,
        renteeLoading,
        ownerLoading
      });
    }, []);

    if (renteeLoading || ownerLoading) {
      console.log("Loading state - not showing dashboard");
      return null;
    }

    if (isCarOwner) {
      return (
        <Link
          to="/carowner-dashboard"
          className="text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors"
        >
          CarOwner Dashboard
        </Link>
      );
    }

    if (isRentee) {
      console.log("Rendering Rentee Dashboard Link");
      return (
        <Link
          to="/rentee-dashboard"
          className="text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors"
        >
          Rentee Dashboard
        </Link>
      );
    }

    console.log("No dashboard link rendered");
    return null;
  };

  const MobileDashboardLink = () => {
    if (renteeLoading || ownerLoading) {
      return null;
    }

    if (isCarOwner) {
      return (
        <Link
          to="/carowner-dashboard"
          className="block px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
        >
          CarOwner Dashboard
        </Link>
      );
    }

    if (isRentee) {
      return (
        <Link
          to="/rentee-dashboard"
          className="block px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
        >
          Rentee Dashboard
        </Link>
      );
    }

    return null;
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
                <DashboardLink />
              </div>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {!renteeLoading && !isRentee && !ownerLoading && !isCarOwner && (
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-black rounded-lg transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                )}
                <div>
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

          {menuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/aboutus"
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
                <MobileDashboardLink />
                {!renteeLoading && !isRentee && !ownerLoading && !isCarOwner && (
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-3"
                  >
                    Sign Up
                  </Link>
                )}
                <div>
                  <appkit-button />
                </div>
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