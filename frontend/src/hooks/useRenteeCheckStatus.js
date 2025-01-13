// useCheckRenteeStatus.js
import { useState, useEffect } from 'react';
import useContractInstance from './useContractInstance1';
import { useAppKitAccount } from "@reown/appkit/react";

export const useCheckRenteeStatus = () => {
  const [isRentee, setIsRentee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();

  useEffect(() => {
    const checkRenteeStatus = async () => {
      if (!contract || !address) {
        setIsRentee(false);
        setIsLoading(false);
        return;
      }

      try {
        // Get rentee profile from the contract and check isRegistered
        const profile = await contract.renteeProfiles(address);
        setIsRentee(profile.isRegistered);
      } catch (error) {
        console.error('Error checking rentee status:', error);
        setIsRentee(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRenteeStatus();
  }, [contract, address]);

  return { isRentee, isLoading };
};