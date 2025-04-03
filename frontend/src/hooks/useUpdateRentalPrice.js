import { useCallback } from "react";
import useContractInstance3 from "./useContractInstance3";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";

const useUpdateRentalPrice = () => {
  const contract = useContractInstance3(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (vehicleId, pricePerHour, securityDeposit) => {
      if (!pricePerHour || !securityDeposit) {
        toast.error("Price and security deposit are required");
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
        toast.error("You're not connected to baseSepolia");
        return;
      }

      try {
        toast.info("Estimating gas...");

        console.log("Update price parameters:", {
          vehicleId,
          pricePerHour,
          securityDeposit,
        });

        const estimatedGas = await contract.updateRentalPrice.estimateGas(
          vehicleId,
          pricePerHour,
          securityDeposit
        );

        const gasLimit = Math.ceil(Number(estimatedGas) * 1.2);

        const tx = await contract.updateRentalPrice(
          vehicleId,
          pricePerHour,
          securityDeposit,
          {
            gasLimit,
          }
        );

        toast.info("Updating price...");
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Price updated successfully");
          return true;
        }
        
        toast.error("Failed to update price");
        return false;
      } catch (err) {
        console.error("Error details:", err);
        const errorDecoder = ErrorDecoder.create();
        try {
          const { reason } = await errorDecoder.decode(err);
          toast.error(reason || "Failed to update price. Please try again.");
        } catch (decodeError) {
          console.error("Error decoding:", decodeError);
          toast.error(
            err.message || "Failed to update price. Please try again."
          );
        }
        return false;
      }
    },
    [contract, address, chainId]
  );
};

export default useUpdateRentalPrice;