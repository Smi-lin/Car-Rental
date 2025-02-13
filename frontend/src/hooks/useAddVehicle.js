import { useCallback } from "react";
import useContractInstance3 from "./useContractInstance3";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { baseSepolia } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";
import { pinata } from "./pinataService";
import { useNavigate } from "react-router-dom";

const useAddVehicle = () => {
  const contract = useContractInstance3(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const navigate = useNavigate();

  return useCallback(
    async (
      imageHash,
      make,
      model,
      rentalTerms,
      pricePerHour,
      securityDeposit
    ) => {
      if (
        !imageHash ||
        !make ||
        !model ||
        !securityDeposit ||
        !rentalTerms ||
        !pricePerHour
      ) {
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
        toast.info("Uploading file...");
        const fileResponse = await pinata.upload.file(imageHash, {
          metadata: {
            name: "profileImage",
            keyvalues: {
              make,
              model,
              rentalTerms,
              pricePerHour,
              securityDeposit,
            },
          },
        });

        if (!fileResponse.IpfsHash) {
          throw new Error("File upload failed");
        }

        const fileUrl = `https://gateway.pinata.cloud/ipfs/${fileResponse.IpfsHash}`;

        toast.info("Uploading metadata to IPFS...");
        const metadata = {
          imageHash: fileResponse.IpfsHash,
          imageUrl: fileUrl,
          make,
          model,
          rentalTerms,
          pricePerHour,
          securityDeposit,
        };

        const metadataBlob = new Blob([JSON.stringify(metadata)], {
          type: "application/json",
        });
        const metadataFile = new File([metadataBlob], "metadata.json", {
          type: "application/json",
        });

        const metadataResponse = await pinata.upload.file(metadataFile, {
          metadata: {
            name: "UserMetadata",
            keyvalues: {
              make,
              model,
              rentalTerms,
              pricePerHour,
              securityDeposit,
            },
          },
        });

        if (!metadataResponse || !metadataResponse.IpfsHash) {
          toast.error("Failed to upload metadata to IPFS");
          return;
        }

        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`;

        toast.info("Estimating gas...");

        console.log("Contract parameters:", {
          imageHash: fileResponse.IpfsHash,
          make,
          model,
          rentalTerms,
          pricePerHour,
          securityDeposit,
        });

        const estimatedGas = await contract.listVehicle.estimateGas(
          fileResponse.IpfsHash,
          make,
          model,
          rentalTerms,
          pricePerHour,
          securityDeposit,
        );

        const gasLimit = Math.ceil(Number(estimatedGas) * 1.2);

        const tx = await contract.listVehicle(
          fileResponse.IpfsHash,
          make,
          model,
          rentalTerms,
          pricePerHour,
          securityDeposit,

          {
            gasLimit,
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success(" Vehicle Added  successfully");
          console.log("IPFS Image Hash:", fileResponse.IpfsHash);
          console.log("IPFS Image URL:", fileUrl);
          console.log("IPFS Metadata URL:", metadataUrl);
          navigate("/fleet");
          return;
        }
        toast.error("Failed to Add car");
      } catch (err) {
        console.error("Error details:", err);
        const errorDecoder = ErrorDecoder.create();
        try {
          const { reason } = await errorDecoder.decode(err);
          toast.error(reason || "Failed to add vehicle. Please try again.");
        } catch (decodeError) {
          console.error("Error decoding:", decodeError);
          toast.error(
            err.message || "Failed to add vehicle. Please try again."
          );
        }
      }
    },
    [contract, address, chainId, navigate]
  );
};

export default useAddVehicle;