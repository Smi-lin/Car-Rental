import React from 'react';
import { toast } from 'react-toastify';
import useUpdateRentalPrice from '../../hooks/useUpdateRentalPrice';

const UpdatePriceModal = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  pricePerHour, 
  setPricePerHour, 
  securityDeposit, 
  setSecurityDeposit, 
  error, 
  isUpdating,
  selectedVehicle // Add this prop to get vehicle ID
}) => {
  const updateRentalPrice = useUpdateRentalPrice();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdating) {
      return;
    }

    if (!pricePerHour || !securityDeposit) {
      toast.error("Please fill in both price fields");
      return;
    }

    if (pricePerHour <= 0 || securityDeposit <= 0) {
      toast.error("Price and security deposit must be greater than 0");
      return;
    }

    try {
      // Call the hook's update function
      const success = await updateRentalPrice(
        selectedVehicle.id,
        pricePerHour,
        securityDeposit
      );

      if (success) {
        await onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Price Update Error:", error);
      toast.error(error.message || "Failed to update price. Please try again.");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Update Rental Price
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Hour (ETH)
            </label>
            <input
              type="number"
              step="0.000001"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter new price per hour"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Deposit (ETH)
            </label>
            <input
              type="number"
              step="0.000001"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter new security deposit"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Price"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePriceModal;