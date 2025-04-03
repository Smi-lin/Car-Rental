import React, { useState, useEffect } from 'react';
import { useCarHive } from "../../context/carHiveContext";
import { MdEdit, MdDirectionsCar, MdPerson, MdEmail, MdStar } from "react-icons/md";

const RenteeProfile = () => {
  const { renteeProfile, address, fetchRenteeProfile } = useCarHive();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeRentals: 0,
    completedRentals: 0,
    averageRating: 0
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (address) {
        try {
          await fetchRenteeProfile(address);
          setProfile(renteeProfile); 
          setIsLoading(false); 
        } catch (error) {
          console.error("Failed to fetch car owner profile:", error);
          setIsLoading(false); 
        }
      }
    };

    loadProfile();
  }, [address, fetchRenteeProfile, renteeProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="-mt-16 relative">
                <img
                  src={`https://ipfs.io/ipfs/${profile?.profileImageHash}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-purple-500"
                />
              
              </div>
              <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MdDirectionsCar className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                  <p className="text-2xl font-semibold text-gray-900">{profile?.totalVehicles}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MdStar className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Average Rating</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MdDirectionsCar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Rentals</p>
                  <p className="text-2xl font-semibold text-gray-900">{profile?.activeRentals}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MdDirectionsCar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed Rentals</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedRentals}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <MdPerson className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="text-gray-900">{profile?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MdEmail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="text-gray-900">{address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenteeProfile;