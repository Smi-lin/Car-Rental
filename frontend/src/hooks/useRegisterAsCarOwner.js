import { useCallback } from "react";
import useContractInstance2 from "./useContractInstance2";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import { pinata } from "./pinataService";
import { useNavigate } from "react-router-dom";


const useRegisterAsCarOwner = () => {
  // const contract = useContractInstance("CONTRACT2", true);
  const contract = useContractInstance2(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const navigate = useNavigate();


  return useCallback(
    async (name, profileImageHash) => {
      if (!name || !profileImageHash) {
        toast.error("Username and Profile photo are required");
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
        // Upload file to IPFS
        toast.info("Uploading file...");
        const fileResponse = await pinata.upload.file(profileImageHash, {
          metadata: {
            name: "ProfileImage",
            keyvalues: { name },
          },
        });

        if (!fileResponse.IpfsHash) {
          throw new Error("File upload failed");
        }

        const fileUrl = `https://gateway.pinata.cloud/ipfs/${fileResponse.IpfsHash}`;

        // Create and upload metadata to IPFS
        toast.info("Uploading metadata to IPFS...");
        const metadata = {
          name,
          profileImageHash: fileResponse.IpfsHash,
          imageUrl: fileUrl
        };

        // Convert metadata object to a Blob
        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        // Create a File object from the Blob
        const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });

        const metadataResponse = await pinata.upload.file(metadataFile, {
          metadata: {
            name: "UserMetadata",
            keyvalues: { name },
          },
        });

        if (!metadataResponse || !metadataResponse.IpfsHash) {
          toast.error("Failed to upload metadata to IPFS");
          return;
        }

        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`;

        // Interact with the smart contract
        toast.info("Estimating gas...");
        
        // Log the parameters being passed to help debug
        console.log("Contract parameters:", {
          name,
          profileImageHash: fileResponse.IpfsHash
        });

        // Only pass username and imageHash to the contract
        const estimatedGas = await contract.registerAsCarOwner.estimateGas(
          name,
          fileResponse.IpfsHash
        );

        const gasLimit = Math.ceil(Number(estimatedGas) * 1.2);

        const tx = await contract.registerAsCarOwner(
          name,
          fileResponse.IpfsHash,
          {
            gasLimit: gasLimit,
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Car Owner registered successfully");
          console.log("IPFS Image Hash:", fileResponse.IpfsHash);
          console.log("IPFS Image URL:", fileUrl);
          console.log("IPFS Metadata URL:", metadataUrl);
          navigate("/carowner-dashboard");
          return;
        }

        toast.error("Failed to register as a Car Owner");
      } catch (err) {
        console.error("Error details:", err);
        const errorDecoder = ErrorDecoder.create();
        try {
          const { reason } = await errorDecoder.decode(err);
          toast.error(reason || "An unexpected error occurred");
        } catch (decodeError) {
          console.error("Error decoding:", decodeError);
          // If we can't decode the error, show the original error message
          toast.error(err.message || "An unexpected error occurred");
        }
      }
    },
    [contract, address, chainId, navigate]
  );
};

export default useRegisterAsCarOwner;