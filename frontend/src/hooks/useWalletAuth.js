// useWalletAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserProvider } from 'ethers';
import { useCheckRenteeStatus } from './useRenteeCheckStatus';
import { useCheckCarOwnerStatus } from './useCarOwnerCheckStatus';

export const useWalletAuth = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const { isRentee, isLoading: renteeLoading } = useCheckRenteeStatus();
  const { isCarOwner, loading: ownerLoading } = useCheckCarOwnerStatus();

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      // Check user status and redirect accordingly
      if (!renteeLoading && !ownerLoading) {
        if (isRentee) {
          navigate('/rentee-dashboard');
        } else if (isCarOwner) {
          navigate('/carowner-dashboard');
        } else {
          navigate('/signup');
        }
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connectWallet, isConnecting };
};