import React from "react";
import { Smartphone, UserCheck, Crown, CreditCard } from "lucide-react";

const ChooseUs = () => {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Easy Online Booking",
      description:
        "Book your premium ride with just a few clicks through our user-friendly online platform",
      bgColor: "bg-[#A7BD80]",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Professional Drivers",
      description:
        "Experienced, vetted chauffeurs ensuring your safety and comfort throughout the journey",
      bgColor: "bg-gray-800",
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Variety of Cars Brands",
      description:
        "Choose from our extensive fleet of luxury vehicles to match your style and needs",
      bgColor: "bg-[#A7BD80]",
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Online Payment",
      description:
        "Secure and convenient payment options for a hassle-free booking experience",
      bgColor: "bg-gray-800",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At CarHive, we pride ourselves in delivering extensive services to
          fulfill all of your needs with first-rate customer care
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
