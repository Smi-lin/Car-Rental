// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { Contract } from "ethers";
// import ABI3 from "../ABI/rentee.json"; // Assuming this is your contract ABI
// import useSignerOrProvider from "../hooks/useSignerOrProvider";
// import useContractInstance from "../hooks/useContractInstance1";
// import useContractInstance2 from "../hooks/useContractInstance2";

// const CarHiveContext = createContext({});

// export const CarHiveContextProvider = ({ children }) => {
//   const { signer, address, readOnlyProvider } = useSignerOrProvider();
//   console.log("Address from useSignerOrProvider:", address);

//   const readOnlyRenteeContract = useContractInstance();
//   const [renteeProfile, setRenteeProfile] = useState({
//     name: "",
//     profileImageHash: "",
//     registrationTimestamp: 0,
//     totalRentals: 0,
//     activeRentals: 0,
//     totalSpending: 0,
//     renteeAddress: "",
//     isRegistered: false,
//   });

//   const [currentRentals, setCurrentRentals] = useState([]);
//   const [pastRentals, setPastRentals] = useState([]);
//   const [carOwnerPastRentals, setCarownerPastRentals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch Rentee Profile from the contract
//   const fetchRenteeProfile = useCallback(async () => {
//     if (!address || !readOnlyRenteeContract) return;

//     console.log("Fetching profile for address:", address);
//     try {
//       setLoading(true);
//       const profile = await readOnlyRenteeContract.getRenteeProfile(address);
//       console.log("Fetched profile:", profile);
//       setRenteeProfile({
//         name: profile.name,
//         profileImageHash: profile.profileImageHash,
//         registrationTimestamp: Number(profile.registrationTimestamp),
//         totalRentals: Number(profile.totalRentals),
//         activeRentals: Number(profile.activeRentals),
//         totalSpending: Number(profile.totalSpending),
//         renteeAddress: profile.renteeAddress,
//         isRegistered: profile.isRegistered,
//       });
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching rentee profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [address, readOnlyRenteeContract]);

//   // Add a current rental
//   const rentalUpdateHandler = useCallback((rental) => {
//     setCurrentRentals((prevRentals) => [
//       ...prevRentals,
//       {
//         vehicleId: Number(rental.vehicleId),
//         start: Number(rental.start),
//         end: Number(rental.end),
//         vehicleData: rental.vehicleData,
//         pricePerHour: Number(rental.pricePerHour),
//         securityDeposit: Number(rental.securityDeposit),
//         vehicleOwner: rental.vehicleOwner,
//         currentRenter: rental.currentRenter,
//         isAvailable: rental.isAvailable,
//         ratings: Number(rental.ratings),
//       },
//     ]);
//   }, []);

//   // Fetch current rentals
//   const fetchCurrentRentals = useCallback(async () => {
//     if (!address || !readOnlyRenteeContract) return;
//     try {
//       setLoading(true);
//       const rentals = await readOnlyRenteeContract.getCurrentRentals(address);
//       setCurrentRentals(
//         rentals.map((rental) => ({
//           vehicleId: Number(rental.vehicleId),
//           start: Number(rental.start),
//           end: Number(rental.end),
//           vehicleData: rental.vehicleData,
//           pricePerHour: Number(rental.pricePerHour),
//           securityDeposit: Number(rental.securityDeposit),
//           vehicleOwner: rental.vehicleOwner,
//           currentRenter: rental.currentRenter,
//           isAvailable: rental.isAvailable,
//           ratings: Number(rental.ratings),
//         }))
//       );
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching current rentals:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [address, readOnlyRenteeContract]);

//   // Fetch past rentals
//   const fetchPastRentals = useCallback(async () => {
//     if (!address || !readOnlyRenteeContract) return;
//     try {
//       setLoading(true);
//       const rentals = await readOnlyRenteeContract.getPastRentals(address);
//       setPastRentals(
//         rentals.map((rental) => ({
//           vehicleId: Number(rental.vehicleId),
//           start: Number(rental.start),
//           end: Number(rental.end),
//           totalCost: Number(rental.totalCost),
//           lateFee: Number(rental.lateFee),
//           refundAmount: Number(rental.refundAmount),
//           vehicleData: rental.vehicleData,
//           pricePerHour: Number(rental.pricePerHour),
//           securityDeposit: Number(rental.securityDeposit),
//           vehicleOwner: rental.vehicleOwner,
//           pastRenter: rental.pastRenter,
//           ratings: Number(rental.ratings),
//         }))
//       );
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching past rentals:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [address, readOnlyRenteeContract]);

//   // Register as Rentee
//   const registerAsRentee = async (name, profileImageHash) => {
//     try {
//       setLoading(true);
//       const tx = await readOnlyRenteeContract.registerAsRentee(
//         name,
//         profileImageHash
//       );
//       await tx.wait();
//       await fetchRenteeProfile();
//     } catch (err) {
//       setError(err.message);
//       console.error("Error registering as rentee:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Rentee Profile
//   const updateProfile = async (name, profileImageHash) => {
//     try {
//       setLoading(true);
//       const tx = await readOnlyRenteeContract.updateRenteeProfile(
//         name,
//         profileImageHash
//       );
//       await tx.wait();
//       setRenteeProfile((prevProfile) => ({
//         ...prevProfile,
//         name,
//         profileImageHash,
//       }));
//     } catch (err) {
//       setError(err.message);
//       console.error("Error updating profile:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch profile and rentals on address change
//   useEffect(() => {
//     if (address) {
//       fetchRenteeProfile();
//       fetchCurrentRentals();
//       fetchPastRentals();
//     }
//   }, [address, fetchRenteeProfile, fetchCurrentRentals, fetchPastRentals]);

//   const readOnlyCarOwnerContract = useContractInstance2();
//   const [carOwnerProfile, setCarOwnerProfile] = useState({
//     name: "",
//     profileImageHash: "",
//     registrationTimestamp: 0,
//     totalVehicles: 0,
//     activeRentals: 0,
//     totalEarnings: 0,
//     carOwnerAddress: "",
//     isRegistered: false,
//   });

//   // Fetch Car Owner Profile from the contract
//   const fetchCarOwnerProfile = useCallback(async () => {
//     if (!address || !readOnlyCarOwnerContract) return;

//     console.log("Fetching profile for address:", address);
//     try {
//       setLoading(true);
//       const profile = await readOnlyCarOwnerContract.getCarOwnerProfile(
//         address
//       );
//       console.log("Fetched profile:", profile);
//       setCarOwnerProfile({
//         name: profile.name,
//         profileImageHash: profile.profileImageHash,
//         registrationTimestamp: Number(profile.registrationTimestamp),
//         totalVehicles: Number(profile.totalVehicles),
//         activeRentals: Number(profile.activeRentals),
//         totalEarnings: Number(profile.totalEarnings),
//         carOwnerAddress: profile.carOwnerAddress,
//         isRegistered: profile.isRegistered,
//       });
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching carowner profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [address, readOnlyCarOwnerContract]);

//   // Fetch past rentals
//   const fetchCarOwnnerPastRentals = useCallback(async () => {
//     if (!address || !readOnlyCarOwnerContract) return;
//     try {
//       setLoading(true);
//       const carOwnerRentals =
//         await readOnlyCarOwnerContract.getCarOwnerPastRentals(address);
//       setCarownerPastRentals(
//         carOwnerRentals.map((rental) => ({
//           vehicleId: Number(rental.vehicleId),
//           start: Number(rental.start),
//           end: Number(rental.end),
//           earnedAmount: Number(rental.earnedAmount),
//           vehicleData: rental.vehicleData,
//           rentee: rental.rentee,
//           isActive: rental.isActive,
//           isPaid: rental.isPaid,
//           review: rental.review,
//           rating: Number(rental.rating),
//         }))
//       );
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching carowner past rentals:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [address, readOnlyCarOwnerContract]);

//   // Register as Car Owner
//   const registerAsCarOwner = async (name, profileImageHash) => {
//     try {
//       setLoading(true);
//       const tx = await readOnlyCarOwnerContract.registerAsCarOwner(
//         name,
//         profileImageHash
//       );
//       await tx.wait();
//       await fetchCarOwnerProfile();
//     } catch (err) {
//       setError(err.message);
//       console.error("Error registering as carowner:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update CarOwner Profile
//   const updateCarOwnerProfile = async (name, profileImageHash) => {
//     try {
//       setLoading(true);
//       const tx = await readOnlyCarOwnerContract.updateCarOwnerProfile(
//         name,
//         profileImageHash
//       );
//       await tx.wait();
//       setCarOwnerProfile((prevProfile) => ({
//         ...prevProfile,
//         name,
//         profileImageHash,
//       }));
//     } catch (err) {
//       setError(err.message);
//       console.error("Error updating profile:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch profile and rentals on address change
//   useEffect(() => {
//     if (address) {
//       fetchCarOwnerProfile();
//       // fetchCurrentRentals();
//       fetchCarOwnnerPastRentals();
//     }
//   }, [address, fetchCarOwnerProfile, fetchCarOwnnerPastRentals]);

//   return (
//     <CarHiveContext.Provider
//       value={{
//         renteeProfile,
//         carOwnerProfile,
//         currentRentals,
//         pastRentals,
//         carOwnerPastRentals,
//         loading,
//         error,
//         registerAsRentee,
//         registerAsCarOwner,
//         updateProfile,
//         updateCarOwnerProfile,
//         rentalUpdateHandler,
//         fetchRenteeProfile,
//         fetchCarOwnerProfile,
//         fetchCurrentRentals,
//         fetchPastRentals,
//         fetchCarOwnnerPastRentals,
//         readOnlyRenteeContract,
//         readOnlyCarOwnerContract,
//       }}
//     >
//       {children}
//     </CarHiveContext.Provider>
//   );
// };

// export const useCarHive = () => {
//   const context = useContext(CarHiveContext);
//   if (!context) {
//     throw new Error("useCarHive must be used within a CarHiveContextProvider");
//   }
//   return context;
// };


import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const readOnlyCarOwnerContract = useContractInstance2();

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

  const [currentRentals, setCurrentRentals] = useState([]);
  const [pastRentals, setPastRentals] = useState([]);
  const [carOwnerPastRentals, setCarownerPastRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRenteeProfile = useCallback(async () => {
    if (!address || !readOnlyRenteeContract) return;

    console.log("Fetching profile for address:", address);
    try {
      setLoading(true);
      const profile = await readOnlyRenteeContract.getRenteeProfile(address);
      console.log("Fetched profile:", profile);
      
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
    try {
      setLoading(true);
      const tx = await readOnlyRenteeContract.registerAsRentee(
        name,
        profileImageHash
      );
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

  const updateProfile = async (name, profileImageHash) => {
    try {
      setLoading(true);
      const tx = await readOnlyRenteeContract.updateRenteeProfile(
        name,
        profileImageHash
      );
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

  const fetchCarOwnerProfile = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;

    console.log("Fetching profile for address:", address);
    try {
      setLoading(true);
      const profile = await readOnlyCarOwnerContract.getCarOwnerProfile(address);
      console.log("Fetched profile:", profile);
      
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
    } catch (err) {
      setError(err.message);
      console.error("Error fetching carowner profile:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyCarOwnerContract]);

  const fetchCarOwnerPastRentals = useCallback(async () => {
    if (!address || !readOnlyCarOwnerContract) return;
    
    try {
      setLoading(true);
      const carOwnerRentals = await readOnlyCarOwnerContract.getCarOwnerPastRentals(address);
      
      setCarownerPastRentals(
        carOwnerRentals.map((rental) => ({
          vehicleId: Number(rental.vehicleId),
          start: Number(rental.start),
          end: Number(rental.end),
          earnedAmount: Number(rental.earnedAmount),
          vehicleData: rental.vehicleData,
          rentee: rental.rentee,
          isActive: rental.isActive,
          isPaid: rental.isPaid,
          review: rental.review,
          rating: Number(rental.rating),
        }))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching carowner past rentals:", err);
    } finally {
      setLoading(false);
    }
  }, [address, readOnlyCarOwnerContract]);

  const registerAsCarOwner = async (name, profileImageHash) => {
    try {
      setLoading(true);
      const tx = await readOnlyCarOwnerContract.registerAsCarOwner(
        name,
        profileImageHash
      );
      await tx.wait();
      await fetchCarOwnerProfile();
    } catch (err) {
      setError(err.message);
      console.error("Error registering as carowner:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCarOwnerProfile = async (name, profileImageHash) => {
    try {
      setLoading(true);
      const tx = await readOnlyCarOwnerContract.updateCarOwnerProfile(
        name,
        profileImageHash
      );
      await tx.wait();
      setCarOwnerProfile((prevProfile) => ({
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
      fetchCarOwnerPastRentals();
    }
  }, [address, fetchCarOwnerProfile, fetchCarOwnerPastRentals]);

  return (
    <CarHiveContext.Provider
      value={{
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
        rentalUpdateHandler,
        fetchRenteeProfile,
        fetchCarOwnerProfile,
        fetchCurrentRentals,
        fetchPastRentals,
        fetchCarOwnerPastRentals,
        readOnlyRenteeContract,
        readOnlyCarOwnerContract,
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