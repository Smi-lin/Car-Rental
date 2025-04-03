import React, { useEffect, useState } from "react";
import { useCarHive } from "../../context/carHiveContext";
import { FaSearch } from "react-icons/fa";
import { MdDirectionsCar, MdEdit, MdDelete } from "react-icons/md";
import UpdatePriceModal from "./UpdatePriceModal";

const AllVehicile = () => {
  const { getVehicles, address, updateVehiclePrice } = useCarHive();
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Price update modal state
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newPricePerHour, setNewPricePerHour] = useState("");
  const [newSecurityDeposit, setNewSecurityDeposit] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!address) return;

      try {
        setIsLoading(true);
        const allVehicles = await getVehicles();
        const userVehicles = allVehicles.filter(
          (vehicle) => vehicle.owner.toLowerCase() === address.toLowerCase()
        );
        setVehicles(userVehicles);
        setFilteredVehicles(userVehicles);
      } catch (err) {
        setError("Failed to fetch vehicles");
        console.error("Error fetching vehicles:", err);
      } finally {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    };

    fetchVehicles();
  }, [address, getVehicles]);

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

  const handlePriceUpdate = async () => {
    if (!selectedVehicle) return;

    if (!newPricePerHour || !newSecurityDeposit) {
      setUpdateError("Please fill in both price fields");
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError("");

      await updateVehiclePrice(
        selectedVehicle.id,
        newPricePerHour,
        newSecurityDeposit
      );

      // Update local state
      const updatedVehicles = vehicles.map(vehicle => {
        if (vehicle.id === selectedVehicle.id) {
          return {
            ...vehicle,
            pricePerHour: newPricePerHour,
            securityDeposit: newSecurityDeposit
          };
        }
        return vehicle;
      });

      setVehicles(updatedVehicles);
      setFilteredVehicles(updatedVehicles);
      
      // Close modal and reset state
      setIsPriceModalOpen(false);
      setSelectedVehicle(null);
      setNewPricePerHour("");
      setNewSecurityDeposit("");
    } catch (err) {
      setUpdateError("Failed to update price. Please try again.");
      console.error("Error updating price:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openPriceModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setNewPricePerHour(vehicle.pricePerHour);
    setNewSecurityDeposit(vehicle.securityDeposit);
    setIsPriceModalOpen(true);
  };

  if (!initialLoadComplete && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-800">
      <div className="bg-[#343a40] text-white p-6 rounded-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MdDirectionsCar className="w-8 h-8" />
          <h1 className="text-2xl font-bold">My Listed Vehicles</h1>
        </div>
        <p className="text-gray-300">
          Manage and monitor all your listed vehicles in one place
        </p>
      </div>

      <div className="mb-8 px-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by make or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <FaSearch
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="relative">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id || index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={`https://ipfs.io/ipfs/${vehicle.imageHash}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-car.jpg";
                    }}
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
                        <span className="text-gray-600 font-medium">
                          Rating:{" "}
                        </span>
                        <span className="text-gray-900">
                          {(vehicle.ratings / 10000).toFixed(1)} ★
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => openPriceModal(vehicle)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <MdEdit className="w-5 h-5" />
                      Update Price
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

      <UpdatePriceModal
  isOpen={isPriceModalOpen}
  onClose={() => {
    setIsPriceModalOpen(false);
    setSelectedVehicle(null);
    setUpdateError("");
  }}
  onUpdate={handlePriceUpdate}
  pricePerHour={newPricePerHour}
  setPricePerHour={setNewPricePerHour}
  securityDeposit={newSecurityDeposit}
  setSecurityDeposit={setNewSecurityDeposit}
  error={updateError}
  isUpdating={isUpdating}
  selectedVehicle={selectedVehicle} 
/>
    </div>
  );
};

export default AllVehicile;