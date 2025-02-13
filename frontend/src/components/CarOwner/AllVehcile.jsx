import React, { useEffect, useState } from 'react';
import { useCarHive } from "../../context/carHiveContext";
import { FaSearch } from "react-icons/fa";
import { MdDirectionsCar, MdEdit, MdDelete } from "react-icons/md";

const AllVehicile = () => {
  const { getVehicles, address } = useCarHive();
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, [address]);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedVehicles = await getVehicles({ owner: address });
      setVehicles(fetchedVehicles);
      setFilteredVehicles(fetchedVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.make?.toLowerCase().includes(searchTermLower) ||
        vehicle.model?.toLowerCase().includes(searchTermLower)
    );
    setFilteredVehicles(filtered);
  };

  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/placeholder-car.jpg";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchVehicles}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-800">
      {/* Header Section */}
      <div className="bg-[#343a40] text-white p-6 rounded-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MdDirectionsCar className="w-8 h-8" />
          <h1 className="text-2xl font-bold">My Listed Vehicles</h1>
        </div>
        <p className="text-gray-300">Manage and monitor all your listed vehicles in one place</p>
      </div>


      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <MdDirectionsCar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms"
              : "You haven't listed any vehicles yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={`https://ipfs.io/ipfs/${vehicle.imageHash}`}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                  onError={handleImageError}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-gray-900 font-semibold">
                    {formatPrice(vehicle.pricePerHour)}/Hr
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.isAvailable ? "Available" : "Rented"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">{vehicle.rentalTerms}</p>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-600 font-medium">
                      Security Deposit:{" "}
                    </span>
                    <span className="text-gray-900">
                      {formatPrice(vehicle.securityDeposit)}
                    </span>
                  </div>

                  {vehicle.ratings > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-600 font-medium">Rating: </span>
                      <span className="text-gray-900">
                        {(vehicle.ratings / 10000).toFixed(1)} ★
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2">
                    <MdEdit className="w-5 h-5" />
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2">
                    <MdDelete className="w-5 h-5" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllVehicile;