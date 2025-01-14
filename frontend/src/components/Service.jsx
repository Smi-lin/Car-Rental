import React from "react";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import lexu from "../assets/fleet1.png";
import lambo from "../assets/fleet2.png";

const Service = () => {
  const services = [
    {
      title: "List Your Car",
      description:
        "Turn your car into a profitable asset. Our platform makes it easy for car owners to list their vehicles and earn passive income. We handle the verification, insurance, and payment processing to ensure a secure experience.",
      image: lexu,
      icon: <MapPin className="w-6 h-6" />,
      features: [
        "Comprehensive insurance coverage",
        "Secure payment processing",
        "24/7 customer support",
      ],
    },
    {
      title: "Rent a Car",
      description:
        "Access a wide selection of quality vehicles for your needs. From luxury cars to everyday vehicles, find the perfect ride with our easy booking system. Enjoy a seamless rental experience with verified owners and transparent pricing.",
      image: lambo,
      icon: <Calendar className="w-6 h-6" />,
      features: [
        "Verified vehicles and owners",
        "Flexible rental periods",
        "Instant booking confirmation",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you're looking to rent out your car or find the perfect vehicle to rent,
            our platform connects car owners and renters in a secure and seamless way
          </p>
        </div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              <div
                className={`md:w-1/2 ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div className="relative group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 transition-opacity duration-500" />
                </div>
              </div>

              <div
                className={`md:w-1/2 space-y-6 ${
                  index % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black text-white mb-4">
                  {service.icon}
                </div>

                <h3 className="text-3xl font-bold">{service.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-700">
                      <div className="w-1.5 h-1.5 bg-black rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="group inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-900 transition-all duration-300">
                  {index === 0 ? "List Your Car" : "Rent Now"}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;