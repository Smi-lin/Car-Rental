import React, { useState } from "react";
import {
  X,
  Clock,
  Car,
  CreditCard,
  Shield,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useCarHive } from "../context/carHiveContext";
import { BrowserProvider } from "ethers";
import { toast } from "react-toastify";
import { siweConfig } from "../config/siwe";

const RentalModal = ({
  isOpen,
  selectedVehicle,
  selectedDuration,
  setSelectedDuration,
  handleConfirmRental,
  onClose,
  formatPrice,
}) => {
  const { updateRentalStats, rentVehicle } = useCarHive();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !selectedVehicle) return null;

  const supportedChains = [
    {
      id: 84532,
      name: "Base Sepolia",
    },
  ];

  const siwe = siweConfig(supportedChains);

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    if (minutes === 60) return "1 hour";
    if (minutes < 1440) {
      const hours = minutes / 60;
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    }
    const days = minutes / 1440;
    return `${days} day${days === 1 ? "" : "s"}`;
  };

  const calculatePrice = (minutes) => {
    const hourlyRate = selectedVehicle.pricePerHour;
    return (hourlyRate / 60) * minutes;
  };

  const calculateTotalCost = () => {
    const rentalCost = calculatePrice(selectedDuration);
    const securityDeposit = Number(selectedVehicle.securityDeposit);
    return rentalCost + securityDeposit;
  };

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

  const handleRentalConfirmation = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    let provider;

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to continue!");
      }

      provider = new BrowserProvider(window.ethereum);

      const networkOk = await checkNetwork(provider);
      if (!networkOk) {
        setIsProcessing(false);
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

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

      toast.info("Processing rental transaction...");
      const tx = await rentVehicle(selectedVehicle.id, selectedDuration);
      await tx.wait();

      const totalCost = calculateTotalCost();
      await updateRentalStats(totalCost);

      toast.success("Vehicle rented successfully!");
      onClose();
    } catch (error) {
      console.error("Rental Error:", error);
      toast.error(
        error.message || "Failed to process rental. Please try again."
      );

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Car className="text-blue-600" size={24} />
            <h3 className="text-2xl font-semibold text-gray-900">
              Rent {selectedVehicle.make} {selectedVehicle.model}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock size={18} className="text-gray-500" />
              Rental Duration
            </label>
            <div className="relative">
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={360}>6 hours</option>
                <option value={720}>12 hours</option>
                <option value={1440}>1 day</option>
                <option value={2880}>2 days</option>
                <option value={4320}>3 days</option>
                <option value={10080}>1 week</option>
              </select>
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-gray-500" />
                <span>Rate</span>
              </div>
              <span className="font-medium">
                {formatPrice(selectedVehicle.pricePerHour)}/hr
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <span>Duration</span>
              </div>
              <span className="font-medium">
                {formatDuration(selectedDuration)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-gray-500" />
                <span>Security deposit</span>
              </div>
              <span className="font-medium">
                {formatPrice(selectedVehicle.securityDeposit)}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between items-center text-base font-semibold text-gray-900">
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-blue-600" />
                  <span>Total cost</span>
                </div>
                <span>
                  {formatPrice(
                    calculatePrice(selectedDuration) +
                      Number(selectedVehicle.securityDeposit)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={handleRentalConfirmation}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} />
              {isProcessing ? "Processing..." : "Confirm Rental"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;
