import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useAddVehicle from "../../hooks/useAddVehicle";
import { useCarHive } from "../../context/carHiveContext";
import { BrowserProvider, parseEther } from "ethers";
import { toast } from "react-toastify";
import { siweConfig } from "../../config/siwe";

const CarOwnerCreateVehicle = () => {
  const addVehicleHook = useAddVehicle();
  const { refreshVehicles } = useCarHive();
  const [imageHash, setImageHash] = useState();
  const [make, setmake] = useState("");
  const [model, setModel] = useState("");
  const [rentalTerms, setRentalTerms] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
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
// Improved decimal validation function
const isValidDecimal = (value) => {
  // Allow empty string, digits, and at most one decimal point
  return /^(\d*\.?\d*)?$/.test(value);
};

// Handle decimal input change
const handleDecimalInput = (value, setter) => {
  if (value === '' || isValidDecimal(value)) {
    setter(value);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isProcessing) return;

    try {
      // Validation
      if (!imageHash || !make || !model || !rentalTerms || !pricePerHour || !securityDeposit) {
        toast.error("Please fill all fields");
        return;
      }

      // Make sure price and deposit are valid numbers
      if (!isValidDecimal(pricePerHour) || !isValidDecimal(securityDeposit)) {
        toast.error("Please enter valid price and deposit values");
        return;
      }

      setIsProcessing(true);

      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new BrowserProvider(window.ethereum);
      
      // Network check
      const networkValid = await checkNetwork(provider);
      if (!networkValid) {
        throw new Error("Please connect to Base Sepolia network");
      }

      // Convert ETH values to Wei
      const priceWei = parseEther(pricePerHour);
      const depositWei = parseEther(securityDeposit);

      console.log("Converting prices to Wei:", {
        pricePerHour,
        securityDeposit,
        priceWei: priceWei.toString(),
        depositWei: depositWei.toString()
      });

      // Call the hook with direct parameters (not an object)
      await addVehicleHook(
        imageHash,
        make,
        model,
        rentalTerms,
        priceWei,
        depositWei
      );

      toast.success("Vehicle listed successfully!");
      navigate("/fleet");
    } catch (error) {
      console.error("Error details:", error);
      toast.error(error.message || "Failed to list vehicle");
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

    {/* Price Per Hour Field */}
<div>
  <label className="pb-2 text-black">
    Price Per Hour (ETH) <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    inputMode="decimal"
    value={pricePerHour}
    onChange={(e) => handleDecimalInput(e.target.value, setPricePerHour)}
    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    placeholder="0.001"
  />
</div>

{/* Security Deposit Field */}
<div>
  <label className="pb-2 text-black">
    Security Deposit (ETH) <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    inputMode="decimal"
    value={securityDeposit}
    onChange={(e) => handleDecimalInput(e.target.value, setSecurityDeposit)}
    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    placeholder="0.1"
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