import { useCallback } from "react";
import useContractInstance2 from "./useContractInstance2";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import { useNavigate } from "react-router-dom";

const useAddActiveRental = () => {
  const contract = useContractInstance2(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const navigate = useNavigate();

  return useCallback(
    async ({
      owner,
      vehicleId,
      vehicleData,
      rentee,
      startTime,
      endTime,
      earnedAmount
    }) => {
      // Input validation
      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== Number(baseSepolia.id)) {
        toast.error("You're not connected to baseSepolia");
        return;
      }

      const requiredFields = {
        owner,
        vehicleId,
        vehicleData,
        rentee,
        startTime,
        endTime,
        earnedAmount
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      try {
        const rentalData = {
          owner,
          vehicleId,
          vehicleData,
          rentee,
          startTime,
          endTime,
          earnedAmount
        };

        // Log the parameters for debugging
        console.log("Contract parameters:", rentalData);

        toast.info("Estimating gas...");
        
        // Estimate gas for the transaction
        const estimatedGas = await contract.addActiveRental.estimateGas(
          owner,
          vehicleId,
          vehicleData,
          rentee,
          startTime,
          endTime,
          earnedAmount
        );

        const gasLimit = Math.ceil(Number(estimatedGas) * 1.2);

        // Execute the transaction
        const tx = await contract.addActiveRental(
          owner,
          vehicleId,
          vehicleData,
          rentee,
          startTime,
          endTime,
          earnedAmount,
          {
            gasLimit
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Active Rental Added successfully");
          navigate("/carowner-dashboard");
          return;
        }

        toast.error("Failed to Add Active rental to dashboard");
      } catch (err) {
        console.error("Error details:", err);
        
        try {
          const errorDecoder = ErrorDecoder.create();
          const { reason } = await errorDecoder.decode(err);
          toast.error(reason || "An unexpected error occurred");
        } catch (decodeError) {
          console.error("Error decoding:", decodeError);
          toast.error(err.message || "An unexpected error occurred");
        }
      }
    },
    [contract, address, chainId, navigate]
  );
};

export default useAddActiveRental;