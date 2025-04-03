import { useCallback } from "react";
import useContractInstance3 from "./useContractInstance3";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const useRentVehicle = () => {
  const contract = useContractInstance3(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const navigate = useNavigate();

  return useCallback(
    async (vehicleId, rentalDuration, rentPrice) => {
      if (!vehicleId || !rentalDuration) {
        toast.error("Vehicle ID and rental duration are required");
        return null;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return null;
      }

      if (!contract) {
        toast.error("Contract not found");
        return null;
      }

      if (Number(chainId) !== Number(baseSepolia.id)) {
        toast.error("You're not connected to Base Sepolia network");
        return null;
      }

      try {
        // Convert duration from minutes to seconds for the blockchain contract
        const durationInSeconds = Number(rentalDuration) * 60;
        
        // If rentPrice is not provided, try to fetch vehicle details from contract
        let totalPrice;
        
        if (!rentPrice) {
          // Log the missing price issue - this helps with debugging
          console.warn("Rent price not provided, attempting to calculate from contract");
          
          try {
            // Try to get vehicle info from contract (you may need to implement this function)
            const vehicleInfo = await contract.getVehicle(vehicleId);
            const hourlyRate = ethers.formatEther(vehicleInfo.pricePerHour);
            const securityDeposit = ethers.formatEther(vehicleInfo.securityDeposit);
            
            // Calculate the price based on duration
            const hours = rentalDuration / 60;
            const calculatedPrice = (hours * hourlyRate) + Number(securityDeposit);
            totalPrice = ethers.parseEther(calculatedPrice.toString());
          } catch (priceError) {
            console.error("Failed to calculate price:", priceError);
            throw new Error("Could not determine rental price. Please try again.");
          }
        } else {
          // Use the provided price
          try {
            totalPrice = ethers.parseEther(rentPrice.toString());
          } catch (parseError) {
            console.error("Failed to parse rent price:", parseError);
            throw new Error("Invalid rental price format");
          }
        }

        console.log("Rental parameters:", {
          vehicleId,
          durationInSeconds,
          rentPrice: totalPrice.toString(),
        });

        toast.info("Estimating gas...");
        
        // Add try-catch for gas estimation
        let gasLimit;
        try {
          const estimatedGas = await contract.rentVehicle.estimateGas(
            vehicleId,
            durationInSeconds,
            {
              value: totalPrice,
            }
          );
          gasLimit = Math.ceil(Number(estimatedGas) * 1.2);
        } catch (gasError) {
          console.error("Gas estimation error:", gasError);
          // Use a fallback gas limit if estimation fails
          gasLimit = 500000;
        }

        toast.info("Processing rental transaction...");

        const tx = await contract.rentVehicle(
          vehicleId,
          durationInSeconds,
          {
            value: totalPrice,
            gasLimit,
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Vehicle rented successfully!");
          console.log("Transaction receipt:", receipt);
          
          navigate("/rental-confirmation", {
            state: {
              rentalDetails: {
                confirmationNumber: `RNT${Date.now()}`,
                vehicleId,
                rentalDuration,
                transactionHash: receipt.transactionHash,
              }
            }
          });
          return receipt;
        }

        toast.error("Failed to rent vehicle");
        return null;
      } catch (err) {
        console.error("Error details:", err);
        
        // First check for common MetaMask or connection errors
        if (err.code === 'NETWORK_ERROR' || err.message?.includes('network')) {
          toast.error("Network connection error. Please check your internet connection.");
          return null;
        }
        
        if (err.code === 'UNPREDICTABLE_GAS_LIMIT' || err.message?.includes('gas')) {
          toast.error("Transaction error: Could not estimate gas. The vehicle may be unavailable.");
          return null;
        }
        
        const errorDecoder = ErrorDecoder.create();
        
        try {
          const { reason } = await errorDecoder.decode(err);
          
          if (reason.includes("Vehicle is already rented")) {
            toast.error("This vehicle is currently rented");
          } else if (reason.includes("Vehicle is not available")) {
            toast.error("This vehicle is not available for rent");
          } else if (reason.includes("Not registered as rentee")) {
            toast.error("You must register as a rentee first");
          } else if (reason.includes("Insufficient balance")) {
            toast.error("Insufficient ETH balance");
          } else if (err.message?.includes("insufficient funds")) {
            toast.error("Insufficient ETH balance to cover rental cost and gas");
          } else {
            toast.error(reason || "Failed to rent vehicle. Please try again.");
          }
        } catch (decodeError) {
          console.error("Error decoding:", decodeError);
          
          if (err.message?.includes("insufficient funds")) {
            toast.error("Insufficient ETH balance to cover rental cost and gas");
          } else if (err.message?.includes("failed to fetch") || err.message?.includes("network")) {
            toast.error("Network error. Please check your internet connection and try again.");
          } else {
            toast.error(
              err.message || "Failed to rent vehicle. Please try again."
            );
          }
        }
        
        return null;
      }
    },
    [contract, address, chainId, navigate]
  );
};

export default useRentVehicle;