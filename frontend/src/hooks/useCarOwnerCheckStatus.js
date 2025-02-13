import { useState, useEffect } from 'react';
import useContractInstance2 from './useContractInstance2';
import { useAppKitAccount } from "@reown/appkit/react";

export const useCheckCarOwnerStatus = () => {
  const [isCarOwner, setIsCarOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const contract = useContractInstance2(true);
  const { address } = useAppKitAccount();

  useEffect(() => {
    const checkCarOwnerStatus = async () => {
      console.log('Checking car owner status:', {
        hasContract: !!contract,
        address,
        contractMethods: contract ? Object.keys(contract) : []
      });

      if (!contract || !address) {
        console.log('Missing contract or address');
        setIsCarOwner(false);
        setLoading(false);
        return;
      }
  
      try {
     
        console.log('Calling contract method for address:', address);
        const profile = await contract.carOwnerProfiles(address);
        
        console.log('Received profile:', profile);

        const isRegistered = profile && profile.isRegistered;
        console.log('Is registered:', isRegistered);
        
        setIsCarOwner(isRegistered);
      } catch (error) {
        console.error('Error checking car owner status:', {
          error,
          errorMessage: error.message,
          contractAddress: contract.address,
          userAddress: address
        });
        setIsCarOwner(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkCarOwnerStatus();
  }, [contract, address]);


  useEffect(() => {
    console.log('Car owner status updated:', {
      isCarOwner,
      loading,
      address
    });
  }, [isCarOwner, loading, address]);

  return { isCarOwner, loading };
};