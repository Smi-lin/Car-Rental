import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Contract } from "ethers";
import ABI2 from "../ABI/carOwner.json";
import ABI3 from "../ABI/rentee.json";
import useSignerOrProvider from "../hooks/useSignerOrProvider";
import useContractInstance from "../hooks/useContractInstance1";

const CarHiveContext = createContext({});

export const CarHiveContextProvider = ({ children }) => {
  const { signer, address } = useSignerOrProvider();
  const readOnlyRenteeContract = useContractInstance();
  const { readOnlyProvider } = useSignerOrProvider();

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

  const fetchRenteeProfile = useCallback(async () => {
    if (!address) return;
    try {
      setLoading(true);
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
    } catch (err) {
      setError(err.message);
      console.error("Error fetching rentee profile:", err);
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

  const fetchCurrentRentals = useCallback(async () => {
    if (!address) return;
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
    if (!address) return;
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

  


useEffect(() => {
  if (!readOnlyProvider || !readOnlyRenteeContract || !process.env.REACT_APP_CONTRACTRENTEE_ADDRESS) {
    console.log("Missing required dependencies for contract events");
    return;
  }

  try {
    const contract = new Contract(
      process.env.REACT_APP_CONTRACTRENTEE_ADDRESS,
      ABI3,
      readOnlyProvider
    );

    const handleNewRental = (rental) => {
      if (rental.currentRenter === address) {
        rentalUpdateHandler(rental);
      }
    };

    const handleRentalCompleted = (vehicleId, renter) => {
      if (renter === address) {
        setCurrentRentals((prevRentals) => 
          prevRentals.filter(rental => rental.vehicleId !== Number(vehicleId))
        );
        fetchPastRentals(); 
      }
    };

 
    if (contract.provider) {
      contract.on("RentalInitiated", handleNewRental);
      contract.on("RentalCompleted", handleRentalCompleted);

    
      return () => {
        contract.off("RentalInitiated", handleNewRental);
        contract.off("RentalCompleted", handleRentalCompleted);
      };
    }
  } catch (error) {
    console.error("Error setting up contract event listeners:", error);
  }
}, [address, readOnlyProvider, rentalUpdateHandler, fetchPastRentals]);




  useEffect(() => {
    if (!readOnlyRenteeContract || !address) return;

    const renteeRegisteredFilter = readOnlyRenteeContract.filters.RenteeRegistered(address);
    const profileUpdatedFilter = readOnlyRenteeContract.filters.renteeProfileUpdated();

    const handleRenteeRegistered = (renteeAddress, name, registrationTime) => {
      if (renteeAddress === address) {
        fetchRenteeProfile();
      }
    };

    const handleProfileUpdated = (name, profileImageHash) => {
      setRenteeProfile((prevProfile) => ({
        ...prevProfile,
        name,
        profileImageHash,
      }));
    };

    readOnlyRenteeContract.on(renteeRegisteredFilter, handleRenteeRegistered);
    readOnlyRenteeContract.on(profileUpdatedFilter, handleProfileUpdated);

    return () => {
      readOnlyRenteeContract.off(renteeRegisteredFilter, handleRenteeRegistered);
      readOnlyRenteeContract.off(profileUpdatedFilter, handleProfileUpdated);
    };
  }, [readOnlyRenteeContract, address, fetchRenteeProfile]);

  useEffect(() => {
    if (address) {
      fetchRenteeProfile();
      fetchCurrentRentals();
      fetchPastRentals();
    }
  }, [address, fetchRenteeProfile, fetchCurrentRentals, fetchPastRentals]);

  return (
    <CarHiveContext.Provider
      value={{
        renteeProfile,
        currentRentals,
        pastRentals,
        loading,
        error,
        registerAsRentee,
        updateProfile,
        fetchCurrentRentals,
        fetchPastRentals,
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
