import { useCallback } from "react";
import useContractInstance from "./useContractInstance1";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import { pinata } from "./pinataService";
import { useNavigate } from "react-router-dom";

const useRegisterAsRentee = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const navigate = useNavigate();

  return useCallback(
    async (name, profileImageHash) => {
      if (!name || !profileImageHash) {
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

        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
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
        
        // Use the IPFS hash from the file upload
        const estimatedGas = await contract.registerAsRentee.estimateGas(
          name,
          fileResponse.IpfsHash  // Use the IPFS hash we got from uploading the file
        );

        const gasLimit = Math.ceil(Number(estimatedGas) * 1.2);

        const tx = await contract.registerAsRentee(
          name,
          fileResponse.IpfsHash,  // Use the same IPFS hash here
          {
            gasLimit: gasLimit,
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Rentee registered successfully");
          console.log("IPFS Image Hash:", fileResponse.IpfsHash);
          console.log("IPFS Image URL:", fileUrl);
          console.log("IPFS Metadata URL:", metadataUrl);
          navigate("/rentee-dashboard");
          return;
        }

        toast.error("Failed to register as a Rentee");
      } catch (err) {
        console.error("Error details:", err);
        const errorDecoder = ErrorDecoder.create();
        try {
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

export default useRegisterAsRentee;