import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Contract } from "ethers";
import ABI3 from "../ABI/rentee.json"; 
import useSignerOrProvider from "../hooks/useSignerOrProvider";
import useContractInstance from "../hooks/useContractInstance1";
import useContractInstance2 from "../hooks/useContractInstance2";
const CarHiveContext = createContext({});

export const CarHiveContextProvider = ({ children }) => {
  const { signer, address, readOnlyProvider } = useSignerOrProvider();
  console.log("Address from useSignerOrProvider:", address);

  const readOnlyRenteeContract = useContractInstance();
  const [renteeProfile, setRenteeProfile] = useState({
    name: "",
    profileImageHash: "",
    registrationTimestamp: 0,
    totalRentals: 0,
    activeRentals: 0,
    totalSpending: 0,
    renteeAddress: "",
    isRegistered: false,
  });

  const [currentRentals, setCurrentRentals] = useState([]);
  const [pastRentals, setPastRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const readOnlyCarOwnerContract = useContractInstance2();
  const [carOwnerProfile, setCarOwnerProfile] = useState({
    name: "",
    profileImageHash: "",
    registrationTimestamp: 0,
    totalVehicles: 0,
    activeRentals: 0,
    totalEarnings: 0,
    carOwnerAddress: "",
    isRegistered: false,
  });

  const [activeRentals, setActivetRentals] = useState([]);
  const [carOwnerPastRentals, setCarOwnerPastRentals] = useState([]);
  const [vehicleListings, setVehicleListings] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);

 
  const fetchRenteeProfile = useCallback(async () => {
    if (!address || !readOnlyRenteeContract) return;

    console.log("Fetching profile for address:", address);
    try {
      setLoading(true);
      const profile = await readOnlyRenteeContract.getRenteeProfile(address);
      console.log('Fetched profile:', profile);
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
    } catch (err) {
      setError(err.message);
      console.error("Error fetching rentee profile:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyRenteeContract]);


  // CarOwner 

  const fetchCarOwnerProfile = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;

    console.log("Fetching profile for CarOwner:", address);
    try {
      setLoading2(true);
      const profile = await  readOnlyCarOwnerContract.getCarOwnerProfile(address);
      console.log('Fetched profile:', profile);
      setCarOwnerProfile({
        name: profile.name,
        profileImageHash: profile.profileImageHash,
        registrationTimestamp: Number(profile.registrationTimestamp),
        totalVehicles: Number(profile.totalVehicles),
        activeRentals: Number(profile.activeRentals),
        totalEarnings: Number(profile.totalEarnings),
        carOwnerAddress:profile.carOwnerAddress,
        isRegistered: profile.isRegistered,
      });
    } catch (err) {
      setError2(err.message);
      console.error("Error fetching rentee profile:", err);
    } finally {
      setLoading2(false);
    }
  }, [address,  readOnlyCarOwnerContract ]);


 ////
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

  /// CarOwner

  const CarOwnerUpdateHandler = useCallback((rental) => {
    setActivetRentals((prevRentals) => [
      ...prevRentals,
      {
        vehicleId: Number(rental.vehicleId),
        vehicleData: rental.vehicleData,
        rentee:rental.rentee,
        start: Number(rental.startTime),
        end: Number(rental.endTime),
        earnedAmount: Number(rental.earnedAmount),
        isActive: true,
        isPaid: false,
        rating: 0,
        review: ""
      },

    ]);
  }, []);


  //////
 
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


  // CarOwner

  const fetchActiveRentals = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;
    try {
      setLoading2(true);
      const rentals = await  readOnlyCarOwnerContract.getActiveRentals(address);
      setActivetRentals(
        rentals.map((rental) => ({
        vehicleId: Number(rental.vehicleId),
        vehicleData: rental.vehicleData,
        rentee:rental.rentee,
        start: Number(rental.startTime),
        end: Number(rental.endTime),
        earnedAmount: Number(rental.earnedAmount),
        isActive:rental.isActive,
        isPaid:rental.isPaid,
        rating:Number(rental.ratings),
        review:rental.review
        }))
      );
    } catch (err) {
      setError2(err.message);
      console.error("Error fetching active rentals:", err);
    } finally {
      setLoading2(false);
    }
  }, [address,  readOnlyCarOwnerContract]);



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

  //CarOwner 

  
  const fetchCarOwnerPastRentals = useCallback(async () => {
    if (!address || ! readOnlyCarOwnerContract) return;
    try {
      setLoading2(true);
      const rentals = await  readOnlyCarOwnerContract.getCarOwnerPastRentals(address);
      setCarOwnerPastRentals(
        rentals.map((rental) => ({
          vehicleId: Number(rental.vehicleId),
        vehicleData: rental.vehicleData,
        rentee:rental.rentee,
        start: Number(rental.startTime),
        end: Number(rental.endTime),
        earnedAmount: Number(rental.totalCost),
        isActive:rental.isActive,
        isPaid:rental.isPaid,
        rating:Number(rental.ratings),
        review:rental.review
        }))
      
      );
    } catch (err) {
      setError2(err.message);
      console.error("Error fetching CarOwner past rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address,  readOnlyCarOwnerContract]);


  //CarOwner 

  const fetchAllCarOwnerVehicleListing = useCallback(async () => {
    if (!address || ! readOnlyCarOwnerContract) return;
    try {
      setLoading2(true);
      const rentals = await  readOnlyCarOwnerContract.getVehicleListings(address);
      setVehicleListings(
        rentals.map((rental) => ({
          vehicleId:rental.vehicleId,
          imageHash:rental.imageHash,
          make:rental.make,
          model:rental.model,
          rentalTerms:rental.rentalTerms,
          pricePerHour:Number(rental.pricePerHour),
          securityDeposit:Number(rental.securityDeposit)
        }))
      
      );
    } catch (err) {
      setError2(err.message);
      console.error("Error fetching CarOwner past rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address,  readOnlyCarOwnerContract]);

  // Register as Rentee
  const registerAsRentee = async (name, profileImageHash) => {
    try {
      setLoading(true);
      const tx = await readOnlyRenteeContract.registerAsRentee(name, profileImageHash);
      await tx.wait();
      await fetchRenteeProfile();
    } catch (err) {
      setError(err.message);
      console.error("Error registering as rentee:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update Rentee Profile
  const updateProfile = async (name, profileImageHash) => {
    try {
      setLoading(true);
      const tx = await readOnlyRenteeContract.updateRenteeProfile(name, profileImageHash);
      await tx.wait();
      setRenteeProfile((prevProfile) => ({
        ...prevProfile,
        name,
        profileImageHash,
      }));
    } catch (err) {
      setError(err.message);
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile and rentals on address change
  useEffect(() => {
    if (address) {
      fetchRenteeProfile();
      fetchCurrentRentals();
      fetchPastRentals();
    }
  }, [address, fetchRenteeProfile, fetchCurrentRentals, fetchPastRentals]);

  useEffect(() => {
    if (address) {
      fetchCarOwnerProfile();
      fetchActiveRentals();
      fetchCarOwnerPastRentals();
      fetchAllCarOwnerVehicleListing()
    }
  }, [address,  fetchCarOwnerProfile,  fetchActiveRentals,  fetchCarOwnerPastRentals, fetchAllCarOwnerVehicleListing ]);

  

  return (
    <CarHiveContext.Provider
      value={{
        renteeProfile,
        currentRentals,
        pastRentals,
        loading,
        error,
        loading2,
        error2,
        carOwnerProfile,
        activeRentals,
        carOwnerPastRentals,
        vehicleListings,
        registerAsRentee,
        updateProfile,
        rentalUpdateHandler,
        fetchRenteeProfile,
        fetchCurrentRentals,
        fetchPastRentals,
        CarOwnerUpdateHandler,
        fetchCarOwnerProfile,
        fetchActiveRentals,
        fetchCarOwnerPastRentals,
        fetchAllCarOwnerVehicleListing,
        readOnlyCarOwnerContract,
        readOnlyRenteeContract,
      }}
    >
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