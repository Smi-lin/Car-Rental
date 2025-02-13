import React, { useEffect, useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { useCarHive } from "../context/carHiveContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import useRentVehicle from "../hooks/useRentVehicle";
import RentalModal from "./RentalModal";

const Fleet = () => {
  const { getVehicles } = useCarHive();
  const { address } = useAppKitAccount();
  const rentVehicle = useRentVehicle();
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [viewMode, setViewMode] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let fetchedVehicles = [];

      // console.log(
      //   "Fetching vehicles with viewMode:",
      //   viewMode,
      //   "address:",
      //   address
      // );

      try {
        if (viewMode === "owned" && address) {
          fetchedVehicles = await getVehicles({ owner: address });
        } else {
          fetchedVehicles = await getVehicles();
        }
      } catch (fetchError) {
        console.error("Detailed fetch error:", {
          error: fetchError,
          message: fetchError.message,
          stack: fetchError.stack,
        });
        throw fetchError;
      }

      // console.log("Fetched vehicles in Fleet:", {
      //   isArray: Array.isArray(fetchedVehicles),
      //   length: fetchedVehicles?.length,
      //   data: fetchedVehicles,
      // });

      if (!Array.isArray(fetchedVehicles)) {
        console.error("Invalid vehicle data:", fetchedVehicles);
        throw new Error("Invalid vehicle data received");
      }

      if (fetchedVehicles.length === 0) {
        console.log("No vehicles found");
      }

      setVehicles(fetchedVehicles);
      setFilteredVehicles(fetchedVehicles);
    } catch (error) {
      console.error("Error in fetchVehicles:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      setError(error.message || "Failed to load vehicles");
      toast.error(
        error.message || "Failed to load vehicles. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [address, viewMode, getVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

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
  const handleRental = async (vehicle) => {
    try {
      if (!address) {
        toast.error("Please connect your wallet to book a vehicle");
        return;
      }

      setSelectedVehicle(vehicle);
      setIsRentModalOpen(true);
    } catch (error) {
      console.error("Error preparing rental:", error);
      toast.error("Failed to prepare rental. Please try again.");
    }
  };

  const handleConfirmRental = async () => {
    try {
      if (!selectedVehicle || !selectedDuration) {
        toast.error("Please select a rental duration");
        return;
      }

      const totalCost = selectedVehicle.pricePerHour * selectedDuration;
      const totalWithDeposit =
        totalCost + Number(selectedVehicle.securityDeposit);

      if (
        !window.confirm(
          `Total cost will be ${formatPrice(totalWithDeposit)} (${formatPrice(
            totalCost
          )} + ${formatPrice(
            selectedVehicle.securityDeposit
          )} deposit). Continue?`
        )
      ) {
        return;
      }

      await rentVehicle(selectedVehicle.id, selectedDuration);

      setIsRentModalOpen(false);
      setSelectedVehicle(null);
      setSelectedDuration(24);

      await fetchVehicles();
    } catch (error) {
      console.error("Error during rental:", error);
    }
  };

  const handleCloseModal = () => {
    setIsRentModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.onerror = null;
    e.target.src = "/placeholder-car.jpg";
  };

  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="pt-8 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-6">
            <div className="relative w-full md:w-[40vw]">
              <input
                type="text"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value.trim()) {
                    setFilteredVehicles(vehicles);
                  }
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
            >
              Search
            </button>
            {address && (
              <button
                onClick={() =>
                  setViewMode(viewMode === "all" ? "owned" : "all")
                }
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors w-full md:w-auto"
              >
                {viewMode === "all" ? "Show My Vehicles" : "Show All Vehicles"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#001524] mb-8">
          {viewMode === "owned" ? "My Listed Vehicles" : "Available Vehicles"}
        </h1>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchVehicles}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm
                ? "No vehicles found matching your search"
                : viewMode === "owned"
                ? "You haven't listed any vehicles yet"
                : "No vehicles available at the moment"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : viewMode === "owned"
                ? "Start by adding your first vehicle"
                : "Check back soon for new listings"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={`https://ipfs.io/ipfs/${vehicle.imageHash}`}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-56 object-cover"
                    onError={handleImageError}
                    onLoad={() =>
                      console.log(
                        "Image loaded successfully:",
                        vehicle.imageHash
                      )
                    }
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
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {vehicle.isAvailable ? "Available" : "Rented"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
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

                  {viewMode !== "owned" && vehicle.isAvailable && (
                    <button
                      onClick={() => handleRental(vehicle)}
                      className="mt-6 w-full bg-[#2d2d2c] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Rent Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <RentalModal
        isOpen={isRentModalOpen}
        selectedVehicle={selectedVehicle}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        handleConfirmRental={handleConfirmRental}
        onClose={handleCloseModal}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default Fleet;
