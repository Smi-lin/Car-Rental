import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";

const useUpdateRenteeProfile = () => {
  const contract = useContractInstance("CONTRACT3", true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async ( username, imageHash) => {
      if (!username || !imageHash) {
        toast.error("All fields are required");
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
        const estimatedGas = await contract.updateRenteeProfile.estimateGas(
          index,
          title,
          description
        );

        const tx = await contract.updateTodo( username, imageHash, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Profile updated successfully");
          return;
        }
        toast.error("Failed to update Profile");
        return;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodedError = await errorDecoder.decode(error);
        console.error("Error updating todo:", decodedError);
        toast.error(decodedError.reason);
      }
    },
    [address, chainId, contract]
  );
};

export default useUpdateRenteeProfile;