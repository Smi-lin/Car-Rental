import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Menu,
  User,
  Calendar,
  Folder,
  Mail,
  Package,
  Briefcase,
  Settings,
  PieChart,
} from 'lucide-react';
import suv from "../../assets/suv.png"


const DashboardHero = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SidebarItem = ({ icon: Icon, title, hasDropdown = false }) => (
    <li className="px-6 py-3">
      <div className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer">
        <Icon className="w-5 h-5 mr-3" />
        <span>{title}</span>
        {hasDropdown && <span className="ml-auto">▼</span>}
      </div>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 w-full">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <img 
              src={suv}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
              <h5 className="text-lg text-gray-300">John Doe</h5>
              <p className="text-sm text-gray-500">Car Owner</p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <ul className="space-y-2">
            <SidebarItem icon={PieChart} title="Dashboard" hasDropdown />
            <SidebarItem icon={Calendar} title="Create Vehicles" />
            <SidebarItem icon={Mail} title="All Vehicles"/>
            <SidebarItem icon={Settings} title="Profile" />
            <SidebarItem icon={Package} title="History" />
            <SidebarItem icon={Briefcase} title="Past Rentals" />
            <SidebarItem icon={Settings} title="Settings" />
            <SidebarItem icon={Settings} title="Disconect Wallet" />
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        {/* Navbar */}
        <nav className="bg-purple-700 p-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <button className="text-white relative">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">23</span>
              </button>
              <button className="text-white relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">98</span>
              </button>
            </div>

          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h1 className="text-2xl font-semibold">Welcome to Dashboard</h1>
            <p className="text-gray-400">Hello John Doe, welcome to your awesome dashboard!</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg flex items-center">
              <div className="bg-blue-500 p-4 rounded-full">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold">1,245</h3>
                  <span className="ml-2 text-gray-400">Rentals</span>
                </div>
                <p className="text-gray-500">Active Rentals</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg flex items-center">
              <div className="bg-red-500 p-4 rounded-full">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold">34</h3>
                  <span className="ml-2 text-gray-400">Projects</span>
                </div>
                <p className="text-gray-500">Active projects</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg flex items-center">
              <div className="bg-green-500 p-4 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold">5,245</h3>
                  <span className="ml-2 text-gray-400">Users</span>
                </div>
                <p className="text-gray-500">Total users</p>
              </div>
            </div>
          </div>



         
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;