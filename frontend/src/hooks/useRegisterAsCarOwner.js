import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";


const useRegisterAsCarOwner = () => {
  const contract = useContractInstance("CONTRACT2", true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();


  return useCallback(
    async (username, imageHash) => {
      if (!username || !imageHash) {
        toast.error("UserName and Profile photo are required");
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
        const estimatedGas = await contract.initiateTransaction.estimateGas(
          amount,
          walletAddress
        
        );

        const tx = await contract.registerAsCarOwner(username, imageHash, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("CarOwner registered successfully");
          return;
        }

        toast.error("Failed to register as a CarOwner");
        return;
      } catch (err) {
        const errorDecoder = ErrorDecoder.create();
        const { reason } = await errorDecoder.decode(err);
        toast.error(reason);
      }
    },
    [contract, address, chainId]
  );
};

export default useRegisterAsCarOwner ;