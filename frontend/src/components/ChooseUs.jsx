import React from "react";
import { Smartphone, UserCheck, Crown, CreditCard } from "lucide-react";

const ChooseUs = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Easy Management",
      description:
        "Simple platform to list your car or find the perfect rental with our user-friendly mobile app",
      bgColor: "bg-[#A7BD80]",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Verified Users",
      description:
        "All car owners and renters undergo thorough verification for a safe and trusted community",
      bgColor: "bg-gray-800",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Flexible Options",
      description:
        "Set your own rental terms as an owner, or choose from diverse vehicles and rental periods as a renter",
      bgColor: "bg-[#A7BD80]",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Payments",
      description:
        "Protected transactions with instant payouts for owners and secure payment options for renters",
      bgColor: "bg-gray-800",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          CarHive connects car owners and renters in a secure marketplace, 
          providing tools and protection for both parties to ensure a smooth 
          car sharing experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              className={`${feature.bgColor} p-6 rounded-2xl mb-6 text-white transform transition-transform hover:scale-105`}
            >
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseUs;