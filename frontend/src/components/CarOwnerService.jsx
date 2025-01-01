import React from "react";
import {
  FaMoneyBillWave,
  FaUserShield,
  FaCalendarCheck,
  FaHandshake,
} from "react-icons/fa";

const CarOwnerService = () => {
  const ownerBenefits = [
    {
      icon: <FaMoneyBillWave className="w-8 h-8 text-red-500" />,
      title: "Earn Extra Income",
      description:
        "Turn your car into a money-making asset. Earn competitive rates while your vehicle is not in use, with secure and timely payments.",
    },
    {
      icon: <FaUserShield className="w-8 h-8 text-red-500" />,
      title: "Full Insurance Coverage",
      description:
        "Rest easy with our comprehensive insurance coverage. Your vehicle is protected against damage, theft, and accidents during rental periods.",
    },
    {
      icon: <FaCalendarCheck className="w-8 h-8 text-red-500" />,
      title: "Flexible Scheduling",
      description:
        "Maintain complete control over your car's availability. Set your own schedule and choose when to make your vehicle available for rent.",
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-red-500" />,
      title: "Professional Support",
      description:
        "Get access to 24/7 customer support, professional vehicle maintenance services, and dedicated account management.",
    },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Car Owner Benefits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our platform and transform your vehicle into a profitable
            asset. We provide everything you need to succeed in the car rental
            business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ownerBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-red-50 rounded-full">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CarOwnerService;
