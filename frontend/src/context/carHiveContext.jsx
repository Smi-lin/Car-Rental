// import {
//     createContext,
//     useCallback,
//     useContext,
//     useEffect,
//     useState,
//   } from "react";
//   import { Contract } from "ethers";
//   import ABI2 from "../ABI/carOwner.json";
//   import ABI3 from "../ABI/rentee.json";
//   import useSignerOrProvider from "../hooks/useSignerOrProvider";
  
//   const CarHiveContext = createContext({});
  
//   export const CarHiveContextProvider = ({ children }) => {
//     const { signer, address } = useSignerOrProvider();
  
//     // Contract instances
//     const carOwnerContract = new Contract(
//       process.env.CONTRACTCAROWNER_ADDRESS,
//       ABI2,
//       signer
//     );
  
//     const renteeContract = new Contract(
//       process.env.CONTRACTRENTEE_ADDRESS,
//       ABI3,
//       signer
//     );
  
//     const [renteeProfile, setRenteeProfile] = useState({
//       name: "",
//       profileImageHash: "",
//       registrationTimestamp: 0,
//       totalRentals: 0,
//       activeRentals: 0,
//       totalSpending: 0,
//       renteeAddress: "",
//       isRegistered: false,
//     });
  
//     const [currentRentals, setCurrentRentals] = useState([]);
//     const [pastRentals, setPastRentals] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
  
   
//     const fetchRenteeProfile = useCallback(async () => {
//       if (!address) return;
//       try {
//         setLoading(true);
//         const profile = await renteeContract.getRenteeProfile(address);
//         setRenteeProfile({
//           name: profile.name,
//           profileImageHash: profile.profileImageHash,
//           registrationTimestamp: Number(profile.registrationTimestamp),
//           totalRentals: Number(profile.totalRentals),
//           activeRentals: Number(profile.activeRentals),
//           totalSpending: Number(profile.totalSpending),
//           renteeAddress: profile.renteeAddress,
//           isRegistered: profile.isRegistered,
//         });
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching rentee profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     }, [address, renteeContract]);
  
  
//     const fetchCurrentRentals = useCallback(async () => {
//       if (!address) return;
//       try {
//         setLoading(true);
//         const rentals = await renteeContract.getCurrentRentals(address);
//         setCurrentRentals(
//           rentals.map((rental) => ({
//             vehicleId: Number(rental.vehicleId),
//             start: Number(rental.start),
//             end: Number(rental.end),
//             vehicleData: rental.vehicleData,
//             pricePerHour: Number(rental.pricePerHour),
//             securityDeposit: Number(rental.securityDeposit),
//             vehicleOwner: rental.vehicleOwner,
//             currentRenter: rental.currentRenter,
//             isAvailable: rental.isAvailable,
//             ratings: Number(rental.ratings),
//           }))
//         );
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching current rentals:", err);
//       } finally {
//         setLoading(false);
//       }
//     }, [address, renteeContract]);
  
//     // Fetch past rentals
//     const fetchPastRentals = useCallback(async () => {
//       if (!address) return;
//       try {
//         setLoading(true);
//         const rentals = await renteeContract.getPastRentals(address);
//         setPastRentals(
//           rentals.map((rental) => ({
//             vehicleId: Number(rental.vehicleId),
//             start: Number(rental.start),
//             end: Number(rental.end),
//             totalCost: Number(rental.totalCost),
//             lateFee: Number(rental.lateFee),
//             refundAmount: Number(rental.refundAmount),
//             vehicleData: rental.vehicleData,
//             pricePerHour: Number(rental.pricePerHour),
//             securityDeposit: Number(rental.securityDeposit),
//             vehicleOwner: rental.vehicleOwner,
//             pastRenter: rental.pastRenter,
//             ratings: Number(rental.ratings),
//           }))
//         );
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching past rentals:", err);
//       } finally {
//         setLoading(false);
//       }
//     }, [address, renteeContract]);
  
    
//     const registerAsRentee = async (name, profileImageHash) => {
//       try {
//         setLoading(true);
//         const tx = await renteeContract.registerAsRentee(name, profileImageHash);
//         await tx.wait();
//         await fetchRenteeProfile();
//       } catch (err) {
//         setError(err.message);
//         console.error("Error registering as rentee:", err);
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     };
  
  
//     const updateProfile = async (name, profileImageHash) => {
//       try {
//         setLoading(true);
//         const tx = await renteeContract.updateRenteeProfile(name, profileImageHash);
//         await tx.wait();
//         setRenteeProfile((prevProfile) => ({
//           ...prevProfile,
//           name,
//           profileImageHash,
//         }));
//       } catch (err) {
//         setError(err.message);
//         console.error("Error updating profile:", err);
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     };
  
    
//     useEffect(() => {
//       if (!renteeContract || !address) return;
  
//       const renteeRegisteredFilter = renteeContract.filters.RenteeRegistered(address);
//       const profileUpdatedFilter = renteeContract.filters.renteeProfileUpdated();
  
//       const handleRenteeRegistered = (renteeAddress, name, registrationTime) => {
//         if (renteeAddress === address) {
//           fetchRenteeProfile(); // Re-fetch the profile after registration
//         }
//       };
  
//       const handleProfileUpdated = (name, profileImageHash) => {
//         setRenteeProfile((prevProfile) => ({
//           ...prevProfile,
//           name,
//           profileImageHash,
//         }));
//       };
  
//       renteeContract.on(renteeRegisteredFilter, handleRenteeRegistered);
//       renteeContract.on(profileUpdatedFilter, handleProfileUpdated);
  
//       return () => {
//         renteeContract.off(renteeRegisteredFilter, handleRenteeRegistered);
//         renteeContract.off(profileUpdatedFilter, handleProfileUpdated);
//       };
//     }, [renteeContract, address, fetchRenteeProfile]);
  

//     useEffect(() => {
//       if (address) {
//         fetchRenteeProfile();
//         fetchCurrentRentals();
//         fetchPastRentals();
//       }
//     }, [address, fetchRenteeProfile, fetchCurrentRentals, fetchPastRentals]);
  
//     return (
//       <CarHiveContext.Provider
//         value={{
//           renteeProfile,
//           currentRentals,
//           pastRentals,
//           loading,
//           error,
//           registerAsRentee,
//           updateProfile,
//           fetchCurrentRentals,
//           fetchPastRentals,
//           carOwnerContract,
//           renteeContract,
//         }}
//       >
//         {children}
//       </CarHiveContext.Provider>
//     );
//   };
  
//   export const useCarHive = () => {
//     const context = useContext(CarHiveContext);
//     if (!context) {
//       throw new Error("useCarHive must be used within a CarHiveContextProvider");
//     }
//     return context;
//   };
  