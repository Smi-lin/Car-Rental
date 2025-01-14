import React, { useState, useEffect } from "react";
import {
  MdNotifications,
  MdMessage,
  MdMenu,
  MdPerson,
  MdCalendarToday,
  MdInventory,
  MdEmail,
  MdWork,
  MdSettings,
  MdPieChart,
  MdFolder,
} from "react-icons/md";
import { useCarHive } from "../../context/carHiveContext";
import CarOwnerCreateVehicle from "./CarOwnerCreateVehicle";

const DashboardHero = () => {

  const {
    carOwnerProfile,
    loading,
    address,
    fetchCarOwnerProfile

  } = useCarHive();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    if (address) {
      fetchCarOwnerProfile(address); // Adjust based on your fetching logic
    }
  }, [address, fetchCarOwnerProfile]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { icon: MdPieChart, text: "Dashboard", id: "dashboard" },
    { icon: MdCalendarToday, text: "Create Vehicles", id: "createVehicles" },
    { icon: MdEmail, text: "All Vehicles", id: "allVehicles" },
    { icon: MdPerson, text: "Profile", id: "profile" },
    { icon: MdInventory, text: "History", id: "history" },
    { icon: MdWork, text: "Past Rentals", id: "pastRentals" },
    { icon: MdSettings, text: "Settings", id: "settings" },
  ];

  // Dashboard component defined within the file
  const Dashboard = () => (
    <>
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow">
        <h1 className="text-2xl font-semibold mb-2">
          Welcome to Dashboard
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading your profile...</p>
        ) : (
          <p className="text-gray-400">{carOwnerProfile?.name ? `${carOwnerProfile.name}, welcome to your awesome dashboard!` : "Profile not found"}</p>
        )}
        {/* <p className="text-gray-400">
          Hello John Doe, welcome to your awesome dashboard!
        </p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-blue-500 p-4 rounded-lg">
              <MdEmail className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className="text-xl font-bold">Active Rentals</h3>
                {/* <span className="ml-2 text-gray-400">Rentals</span> */}
              </div>
              <p className="text-gray-500">{carOwnerProfile?.activeRentals}</p>           
               </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-red-500 p-4 rounded-lg">
              <MdFolder className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className="text-xl font-bold">All Vehicles</h3>
                {/* <span className="ml-2 text-gray-400">Vehicles</span> */}
              </div>
              <p className="text-gray-500">
              {carOwnerProfile?.totalVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="bg-green-500 p-4 rounded-lg">
              <MdPerson className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className="text-xl font-bold">Earned</h3>
                {/* <span className="ml-2 text-gray-400">Earned</span> */}
              </div>
              <p className="text-gray-500">{carOwnerProfile?.totalEarnings} USDC</p>         
              </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "createVehicles":
        return <CarOwnerCreateVehicle />;
      default:
        return <Dashboard />;
    }
  };

  const SidebarItem = ({ icon: Icon, text, id }) => {
    const isActive = activeView === id;

    return (
      <li className="px-4">
        <button
          onClick={() => setActiveView(id)}
          className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 w-full
            ${
              isActive
                ? "bg-purple-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span className="font-medium">{text}</span>
          {isActive && (
            <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 w-full">
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
          <img
              src={`https://ipfs.io/ipfs/${carOwnerProfile?.profileImageHash}`}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-purple-500"
            />
            <div className="ml-3">
            <h5 className="text-lg text-gray-300 font-medium">{carOwnerProfile?.name}</h5>
            <p className="text-sm text-purple-400">{carOwnerProfile?.carOwnerAddress?.slice(0, 6)}...{carOwnerProfile?.carOwnerAddress?.slice(-4)}</p>
            </div>
          </div>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                id={item.id}
              />
            ))}
          </ul>
        </nav>
      </aside>

      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-0"
        } transition-margin duration-300 ease-in-out`}
      >
        <nav className="bg-purple-700 p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2 hover:bg-purple-600 rounded-lg transition-colors"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="text-white relative hover:bg-purple-600 p-2 rounded-lg transition-colors">
                <MdNotifications className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  98
                </span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashboardHero;