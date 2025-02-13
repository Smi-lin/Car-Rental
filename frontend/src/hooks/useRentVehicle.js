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
        return;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== Number(baseSepolia.id)) {
        toast.error("You're not connected to Base Sepolia network");
        return;
      }

      try {

        const durationInSeconds = Number(rentalDuration) * 3600;

        const totalPrice = ethers.parseEther(rentPrice.toString());

        console.log("Rental parameters:", {
          vehicleId,
          durationInSeconds,
          rentPrice: totalPrice.toString(),
        });

        toast.info("Estimating gas...");
        const estimatedGas = await contract.rentVehicle.estimateGas(
          vehicleId,
          durationInSeconds,
          {
            value: totalPrice,
          }
        );

        const gasLimit = Math.ceil(Number(estimatedGas) * 1.2);

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
      } catch (err) {
        console.error("Error details:", err);
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
          } else if (err.message.includes("insufficient funds")) {
            toast.error("Insufficient ETH balance to cover rental cost and gas");
          } else {
            toast.error(reason || "Failed to rent vehicle. Please try again.");
          }
        } catch (decodeError) {
          console.error("Error decoding:", decodeError);
          
          if (err.message.includes("insufficient funds")) {
            toast.error("Insufficient ETH balance to cover rental cost and gas");
          } else {
            toast.error(
              err.message || "Failed to rent vehicle. Please try again."
            );
          }
        }
      }
    },
    [contract, address, chainId, navigate]
  );
};

export default useRentVehicle;