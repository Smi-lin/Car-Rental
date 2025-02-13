import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useAddVehicle from "../../hooks/useAddVehicle";
import { useCarHive } from "../../context/carHiveContext";
import { BrowserProvider } from "ethers";
import { toast } from "react-toastify";
import { siweConfig } from "../../config/siwe";

const CarOwnerCreateVehicle = () => {
  const addVehicleHook = useAddVehicle();
  const { refreshVehicles } = useCarHive();
  const [imageHash, setImageHash] = useState();
  const [make, setmake] = useState("");
  const [model, setModel] = useState("");
  const [rentalTerms, setRentalTerms] = useState("");
  const [pricePerHour, setPricePerHour] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const supportedChains = [
    {
      id: 84532,
      name: "Base Sepolia",
    },
  ];

  const siwe = siweConfig(supportedChains);

  const checkNetwork = async (provider) => {
    try {
      const network = await provider.getNetwork();
      if (network.chainId !== 84532n) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }],
        });
      }
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x14a34",
                chainName: "Base Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
          return true;
        } catch (addError) {
          toast.error("Failed to add Base Sepolia network");
          return false;
        }
      }
      toast.error("Failed to switch to Base Sepolia network");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessing) {
      return;
    }

    // Validate all fields
    if (
      !imageHash ||
      !make ||
      !model ||
      !rentalTerms ||
      !pricePerHour ||
      !securityDeposit
    ) {
      toast.error("Please fill all fields and upload required files.");
      return;
    }

    if (pricePerHour <= 0 || securityDeposit <= 0) {
      toast.error("Price and security deposit must be greater than 0");
      return;
    }

    setIsProcessing(true);
    let provider;

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to continue!");
      }

      provider = new BrowserProvider(window.ethereum);

      // Check network first
      const networkOk = await checkNetwork(provider);
      if (!networkOk) {
        setIsProcessing(false);
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // SIWE Authentication
      const messageParams = await siwe.getMessageParams();
      const message = siwe.createMessage({
        address,
        chainId,
        ...messageParams,
      });

      const signature = await signer.signMessage(message);
      const verified = await siwe.verifyMessage({ message, signature });

      if (!verified) {
        throw new Error("Signature verification failed");
      }

      const session = await siwe.getSession();
      if (!session) {
        throw new Error("Failed to establish session");
      }

      // Call contract
      toast.info("Processing vehicle listing...");
      const tx = await addVehicleHook(
        imageHash,
        make,
        model,
        rentalTerms,
        pricePerHour,
        securityDeposit
      );

      await tx.wait();
      await refreshVehicles();

      toast.success("Vehicle listed successfully!");
      navigate("/fleet");
    } catch (error) {
      console.error("Vehicle Creation Error:", error);
      toast.error(error.message || "Failed to list vehicle. Please try again.");

      if (siwe) {
        try {
          await siwe.signOut();
        } catch (signOutError) {
          console.error("Sign out error:", signOutError);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      try {
        setImageHash(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error handling image:", error);
        toast.error("Error uploading image. Please try again.");
      }
    }
  };

  return (
    <div className="w-[60%] 800px:w-[50%] shadow h-[100vh] rounded-[4px] p-3 text-black ml-[20rem]">
      <h5 className="text-[30px] font-Poppins text-center">Create Vehicle</h5>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="pb-2 text-black">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={make}
              onChange={(e) => setmake(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter make"
            />
          </div>

          <div>
            <label className="pb-2 text-black">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter model"
            />
          </div>

          <div>
            <label className="pb-2 text-black">
              Rental Terms <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rentalTerms}
              onChange={(e) => setRentalTerms(e.target.value)}
              className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows="4"
              placeholder="Enter rental terms"
            />
          </div>

          <div>
            <label className="pb-2 text-black">
              Price Per Hour <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter price per hour"
            />
          </div>

          <div>
            <label className="pb-2 text-black">
              Security Deposit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter security deposit"
            />
          </div>

          <div>
            <label className="pb-2 text-black cursor-pointer">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              id="upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md mr-2"
                />
              ) : (
                <label htmlFor="upload" className="cursor-pointer">
                  <AiOutlinePlusCircle
                    size={30}
                    className="mt-3"
                    color="#555"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <button
              className={`w-full sm:w-[15vw] ${
                isProcessing ? "bg-gray-400" : "bg-[#F5A624]"
              } text-white py-3 rounded-lg hover:bg-[#e69816] transition-colors`}
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "List Vehicle"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CarOwnerCreateVehicle;
