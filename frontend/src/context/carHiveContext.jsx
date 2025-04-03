import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useSignerOrProvider from "../hooks/useSignerOrProvider";
import useContractInstance from "../hooks/useContractInstance1";
import useContractInstance2 from "../hooks/useContractInstance2";
import useContractInstance3 from "../hooks/useContractInstance3";
import { parseEther } from "ethers";

const initialRenteeProfile = {
  name: "",
  profileImageHash: "",
  registrationTimestamp: 0,
  totalRentals: 0,
  activeRentals: 0,
  totalSpending: 0,
  renteeAddress: "",
  isRegistered: false,
};

const initialCarOwnerProfile = {
  name: "",
  profileImageHash: "",
  registrationTimestamp: 0,
  totalVehicles: 0,
  activeRentals: 0,
  totalEarnings: 0,
  carOwnerAddress: "",
  isRegistered: false,
};

const CarHiveContext = createContext({});

export const CarHiveContextProvider = ({ children }) => {
  const { address, readOnlyProvider } = useSignerOrProvider();
  const readOnlyRenteeContract = useContractInstance();
  const readOnlyCarOwnerContract = useContractInstance2();
  const readyOnlyCarHiveContract = useContractInstance3();
  const signerCarHiveContract = useContractInstance3(true);

  // State management
  const [renteeProfile, setRenteeProfile] = useState(initialRenteeProfile);
  const [carOwnerProfile, setCarOwnerProfile] = useState(
    initialCarOwnerProfile
  );
  const [currentRentals, setCurrentRentals] = useState([]);
  const [pastRentals, setPastRentals] = useState([]);
  const [carOwnerPastRentals, setCarOwnerPastRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [activeRentals, setActivetRentals] = useState([]);

  const withErrorHandling = async (operation, errorMessage) => {
    try {
      setLoading(true);
      await operation();
    } catch (err) {
      setError(err.message);
      console.error(errorMessage, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStats = async (rentalAmount) => {
    setRenteeProfile((prev) => ({
      ...prev,
      activeRentals: prev.activeRentals + 1,
      totalRentals: prev.totalRentals + 1,
      totalSpending: prev.totalSpending + rentalAmount,
    }));

    try {
      const tx = await readOnlyRenteeContract.updateRenteeStats(
        renteeProfile.renteeAddress,
        renteeProfile.activeRentals + 1,
        renteeProfile.totalRentals + 1,
        renteeProfile.totalSpending + rentalAmount
      );
      await tx.wait();
    } catch (error) {
      console.error("Failed to update rental stats:", error);
      setRenteeProfile((prev) => ({
        ...prev,
        activeRentals: prev.activeRentals - 1,
        totalRentals: prev.totalRentals - 1,
        totalSpending: prev.totalSpending - rentalAmount,
      }));
      throw error;
    }
  };

  const fetchRenteeProfile = useCallback(async () => {
    if (!address || !readOnlyRenteeContract) return;

    await withErrorHandling(async () => {
      const profile = await readOnlyRenteeContract.getRenteeProfile(address);
      setRenteeProfile({
        name: profile.name,
        profileImageHash: profile.profileImageHash,
        registrationTimestamp: Number(profile.registrationTimestamp),
        totalRentals: Number(profile.totalRentals),
        activeRentals: Number(profile.activeRentals),
        totalSpending: Number(profile.totalSpending),
        renteeAddress: profile.renteeAddress,
        isRegistered: profile.isRegistered,
      });
    }, "Error fetching rentee profile");
  }, [address, readOnlyRenteeContract]);

  const fetchCurrentRentals = useCallback(async () => {
    if (!address || !readOnlyRenteeContract) return;
    try {
      setLoading(true);
      const rentals = await readOnlyRenteeContract.getCurrentRentals(address);
      setCurrentRentals(
        rentals.map((rental) => ({
          vehicleId: Number(rental.vehicleId),
          start: Number(rental.start),
          end: Number(rental.end),
          vehicleData: rental.vehicleData,
          pricePerHour: Number(rental.pricePerHour),
          securityDeposit: Number(rental.securityDeposit),
          vehicleOwner: rental.vehicleOwner,
          currentRenter: rental.currentRenter,
          isAvailable: rental.isAvailable,
          ratings: Number(rental.ratings),
        }))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching current rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyRenteeContract]);

  const fetchActiveRentals = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;
    try {
      setLoading(true);
      const rentals = await readOnlyCarOwnerContract.getActiveRentals(address);
      setActivetRentals(
        rentals.map((rental) => ({
          vehicleId: Number(rental.vehicleId),
          vehicleData: rental.vehicleData,
          rentee: rental.rentee,
          start: Number(rental.startTime),
          end: Number(rental.endTime),
          earnedAmount: Number(rental.earnedAmount),
          isActive: rental.isActive,
          isPaid: rental.isPaid,
          rating: Number(rental.ratings),
          review: rental.review,
        }))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching active rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyCarOwnerContract]);

  const fetchPastRentals = useCallback(async () => {
    if (!address || !readOnlyRenteeContract) return;
    try {
      setLoading(true);
      const rentals = await readOnlyRenteeContract.getPastRentals(address);
      setPastRentals(
        rentals.map((rental) => ({
          vehicleId: Number(rental.vehicleId),
          start: Number(rental.start),
          end: Number(rental.end),
          totalCost: Number(rental.totalCost),
          lateFee: Number(rental.lateFee),
          refundAmount: Number(rental.refundAmount),
          vehicleData: rental.vehicleData,
          pricePerHour: Number(rental.pricePerHour),
          securityDeposit: Number(rental.securityDeposit),
          vehicleOwner: rental.vehicleOwner,
          pastRenter: rental.pastRenter,
          ratings: Number(rental.ratings),
        }))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching past rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyRenteeContract]);

  const fetchCarOwnerProfile = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;

    await withErrorHandling(async () => {
      const profile = await readOnlyCarOwnerContract.getCarOwnerProfile(
        address
      );
      setCarOwnerProfile({
        name: profile.name,
        profileImageHash: profile.profileImageHash,
        registrationTimestamp: Number(profile.registrationTimestamp),
        totalVehicles: Number(profile.totalVehicles),
        activeRentals: Number(profile.activeRentals),
        totalEarnings: Number(profile.totalEarnings),
        carOwnerAddress: profile.carOwnerAddress,
        isRegistered: profile.isRegistered,
      });
    }, "Error fetching car owner profile");
  }, [address, readOnlyCarOwnerContract]);

  const fetchCarOwnerPastRentals = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;
    try {
      setLoading(true);
      const rentals = await readOnlyCarOwnerContract.getCarOwnerPastRentals(
        address
      );
      setCarOwnerPastRentals(
        rentals.map((rental) => ({
          vehicleId: Number(rental.vehicleId),
          vehicleData: rental.vehicleData,
          rentee: rental.rentee,
          start: Number(rental.startTime),
          end: Number(rental.endTime),
          earnedAmount: Number(rental.totalCost),
          isActive: rental.isActive,
          isPaid: rental.isPaid,
          rating: Number(rental.ratings),
          review: rental.review,
        }))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching CarOwner past rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyCarOwnerContract]);

  const rentalUpdateHandler = useCallback((rental) => {
    setCurrentRentals((prevRentals) => [
      ...prevRentals,
      {
        vehicleId: Number(rental.vehicleId),
        start: Number(rental.start),
        end: Number(rental.end),
        vehicleData: rental.vehicleData,
        pricePerHour: Number(rental.pricePerHour),
        securityDeposit: Number(rental.securityDeposit),
        vehicleOwner: rental.vehicleOwner,
        currentRenter: rental.currentRenter,
        isAvailable: rental.isAvailable,
        ratings: Number(rental.ratings),
      },
    ]);
  }, []);

  const registerAsRentee = async (name, profileImageHash) => {
    await withErrorHandling(async () => {
      const tx = await readOnlyRenteeContract.registerAsRentee(
        name,
        profileImageHash
      );
      await tx.wait();
      await fetchRenteeProfile();
    }, "Error registering as rentee");
  };

  const registerAsCarOwner = async (name, profileImageHash) => {
    await withErrorHandling(async () => {
      const tx = await readOnlyCarOwnerContract.registerAsCarOwner(
        name,
        profileImageHash
      );
      await tx.wait();
      await fetchCarOwnerProfile();
    }, "Error registering as car owner");
  };

  const updateProfile = async (name, profileImageHash) => {
    await withErrorHandling(async () => {
      const tx = await readOnlyRenteeContract.updateRenteeProfile(
        name,
        profileImageHash
      );
      await tx.wait();
      setRenteeProfile((prev) => ({ ...prev, name, profileImageHash }));
    }, "Error updating rentee profile");
  };

  const updateCarOwnerProfile = async (name, profileImageHash) => {
    await withErrorHandling(async () => {
      const tx = await readOnlyCarOwnerContract.updateCarOwnerProfile(
        name,
        profileImageHash
      );
      await tx.wait();
      setCarOwnerProfile((prev) => ({ ...prev, name, profileImageHash }));
    }, "Error updating car owner profile");
  };

  const addVehicle = async (params) => {
    const {
      imageHash,
      make,
      model,
      rentalTerms,
      pricePerHour,
      securityDeposit,
    } = params;

    await withErrorHandling(async () => {
      if (!readyOnlyCarHiveContract) {
        throw new Error("Contract not initialized");
      }

      const tx = await readyOnlyCarHiveContract.listVehicle(
        imageHash,
        make,
        model,
        rentalTerms,
        pricePerHour,
        securityDeposit
      );

      const receipt = await tx.wait();
      console.log("Vehicle added, transaction receipt:", receipt);

      await refreshVehicles();

      return receipt;
    }, "Error adding vehicle");
  };

  const getVehicles = async (params = {}) => {
    try {
      if (!readyOnlyCarHiveContract) {
        throw new Error("Contract not initialized");
      }

      let fetchedVehicles;
      try {
        if (params.owner) {
          fetchedVehicles = await readyOnlyCarHiveContract.getVehicleListings(
            params.owner
          );
        } else {
          fetchedVehicles = await readyOnlyCarHiveContract.getAllVehicles();
        }

        const processedVehicles = fetchedVehicles.map((vehicle) => {
          const [imageHash, make, model, rentalTerms] =
            vehicle.vehicleData || [];

          return {
            id: Number(vehicle.id || 0),
            make: make || "Unknown Make",
            model: model || "Unknown Model",
            imageHash: imageHash || "",
            rentalTerms: rentalTerms || "",
            pricePerHour: Number(vehicle.pricePerHour || 0),
            securityDeposit: Number(vehicle.securityDeposit || 0),
            owner: vehicle.vehicleOwner || "",
            currentRenter: vehicle.currentRenter || "",
            isAvailable: Boolean(vehicle.isAvailable),
            ratings: Number(vehicle.ratings || 0),
            reviews: vehicle.reviews || [],
            ratingsByRenters: vehicle.ratingsByRenters || [],
          };
        });

        return processedVehicles;
      } catch (contractError) {
        console.error("Contract call error:", {
          error: contractError,
          message: contractError.message,
          stack: contractError.stack,
        });
        throw contractError;
      }
    } catch (error) {
      console.error("Error in getVehicles:", error);
      throw error;
    }
  };

  const addActiveRent = async (params) => {
    const {
      owner,
      vehicleId,
      vehicleData,
      rentee,
      startTime,
      endTime,
      earnedAmount,
    } = params;
    await withErrorHandling(async () => {
      const tx = await readOnlyCarOwnerContract.addVehicleListing(
        owner,
        vehicleId,
        vehicleData,
        rentee,
        startTime,
        endTime,
        earnedAmount
      );
      await tx.wait();
      await fetchCarOwnerProfile();
    }, "Error adding active rental");
  };

  const updateVehiclePrice = async (vehicleId, pricePerHour, securityDeposit) => {
    await withErrorHandling(async () => {
      if (!readyOnlyCarHiveContract) {
        throw new Error("Contract not initialized");
      }

      const tx = await readyOnlyCarHiveContract.updateRentalPrice(
        vehicleId,
        pricePerHour,
        securityDeposit
      );

      const receipt = await tx.wait();
      console.log("Price updated, transaction receipt:", receipt);

      // Refresh the vehicles list to show updated prices
      await refreshVehicles();

      return receipt;
    }, "Error updating vehicle price");
  };


  const refreshVehicles = useCallback(async () => {
    try {
      await getVehicles();
    } catch (error) {
      console.error("Error refreshing vehicles:", error);
      throw error;
    }
  }, [getVehicles]);

  const rentVehicle = async (vehicleId, rentalDuration) => {
    return await withErrorHandling(async () => {
      if (!signerCarHiveContract) {
        throw new Error("Contract not initialized");
      }
  
      try {
        const vehicles = await getVehicles();
        const vehicle = vehicles.find((v) => v.id === vehicleId);
  
        if (!vehicle) {
          throw new Error("Vehicle not found");
        }
  
        // Convert minutes to seconds for the blockchain
        const durationInSeconds = rentalDuration * 60; 
  
        // Calculate total cost using regular math first
        const durationInHours = Math.max(1, Math.ceil(rentalDuration / 60));
        const rentalAmount = vehicle.pricePerHour * durationInHours;
        const totalAmount = rentalAmount + Number(vehicle.securityDeposit);
  
        // Convert final amount to wei
        const totalCost = parseEther(totalAmount.toString());
  
        console.log("Renting vehicle:", {
          vehicleId,
          durationInMinutes: rentalDuration,
          durationInSeconds,
          rentalAmount,
          securityDeposit: vehicle.securityDeposit,
          totalCost: totalCost.toString(),
        });
  
        // // First check if vehicle is still available
        // const isAvailable = await signerCarHiveContract.isVehicleAvailable(vehicleId);
        // if (!isAvailable) {
        //   throw new Error("Vehicle is no longer available");
        // }
  
        // Estimate gas first to catch potential errors before sending transaction
        let gasLimit;
        try {
          const estimatedGas = await signerCarHiveContract.rentVehicle.estimateGas(
            vehicleId,
            durationInSeconds,
            {
              value: totalCost,
            }
          );
          gasLimit = Math.ceil(Number(estimatedGas) * 1.2);
        } catch (gasError) {
          console.error("Gas estimation failed:", gasError);
          
          // Check for specific error cases
          if (gasError.message?.includes("execution reverted")) {
            if (gasError.message.includes("Already rented") || 
                gasError.message.includes("not available")) {
              throw new Error("Vehicle is already rented or unavailable");
            }
            if (gasError.message.includes("Not registered as rentee")) {
              throw new Error("You must register as a rentee first");
            }
          }
          
          // Use fallback gas limit if error isn't recognized
          gasLimit = 500000;
        }
  
        // Send the transaction with the calculated value and gas limit
        const tx = await signerCarHiveContract.rentVehicle(
          vehicleId,
          durationInSeconds,
          {
            value: totalCost,
            gasLimit,
          }
        );
  
        const receipt = await tx.wait();
        console.log("Vehicle rented, transaction receipt:", receipt);
  
        // Update local state
        setRenteeProfile((prev) => ({
          ...prev,
          activeRentals: prev.activeRentals + 1,
          totalRentals: prev.totalRentals + 1,
        }));
  
        // Refresh all relevant data after rental
        await Promise.all([
          fetchCurrentRentals(),
          fetchRenteeProfile(),
          fetchPastRentals(),
          refreshVehicles(),
        ]).catch(refreshError => {
          console.warn("Error refreshing data after rental:", refreshError);
          // Don't fail the transaction if refresh fails
        });
  
        return receipt;
      } catch (error) {
        console.error("Rental error details:", {
          error,
          message: error.message,
          code: error.code,
          data: error.data,
        });
        
        // Check for network errors
        if (error.message?.includes("failed to fetch") || 
            error.message?.includes("network") ||
            error.code === "NETWORK_ERROR") {
          throw new Error("Network connection error. Please check your internet connection and try again.");
        }
        
        throw error;
      }
    }, "Error renting vehicle");
  };

  const completeRental = async (vehicleId) => {
    await withErrorHandling(async () => {
      if (!readyOnlyCarHiveContract) {
        throw new Error("Contract not initialized");
      }

      const tx = await readyOnlyCarHiveContract.completeRental(vehicleId);
      const receipt = await tx.wait();

      setRenteeProfile((prev) => ({
        ...prev,
        activeRentals: Math.max(0, prev.activeRentals - 1),
      }));

      await Promise.all([
        fetchCurrentRentals(),
        fetchRenteeProfile(),
        fetchPastRentals(),
        refreshVehicles(),
      ]);

      return receipt;
    }, "Error completing rental");
  };

  useEffect(() => {
    if (address) {
      Promise.all([
        fetchRenteeProfile(),
        fetchCurrentRentals(),
        fetchPastRentals(),
        fetchActiveRentals(),
        fetchCarOwnerProfile(),
        fetchCarOwnerPastRentals(),
        getVehicles(),
      ]).catch(console.error);
    }
  }, [
    address,
    fetchRenteeProfile,
    fetchCurrentRentals,
    fetchPastRentals,
    fetchActiveRentals,
    fetchCarOwnerProfile,
    fetchCarOwnerPastRentals,
    getVehicles,
  ]);

  const contextValue = {
    vehicles,
    refreshVehicles,
    renteeProfile,
    carOwnerProfile,
    currentRentals,
    pastRentals,
    carOwnerPastRentals,
    loading,
    error,
    registerAsRentee,
    registerAsCarOwner,
    updateProfile,
    updateCarOwnerProfile,
    fetchRenteeProfile,
    fetchCarOwnerProfile,
    rentalUpdateHandler,
    fetchCurrentRentals,
    fetchPastRentals,
    fetchCarOwnerPastRentals,
    addVehicle,
    addActiveRent,
    getVehicles,
    readOnlyRenteeContract,
    readOnlyCarOwnerContract,
    rentVehicle,
    updateRentalStats,
    completeRental,
    fetchActiveRentals,
    address,
    updateVehiclePrice

  };

  return (
    <CarHiveContext.Provider value={contextValue}>
      {children}
    </CarHiveContext.Provider>
  );
};

export const useCarHive = () => {
  const context = useContext(CarHiveContext);
  if (!context) {
    throw new Error("useCarHive must be used within a CarHiveContextProvider");
  }
  return context;
};

export default useCarHive;
