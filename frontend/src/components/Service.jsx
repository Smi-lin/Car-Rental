import React from "react";
import { ArrowRight, Clock, MapPin, Calendar } from "lucide-react";
import lexu from "../assets/fleet1.png";
import lambo from "../assets/fleet2.png";

const Service = () => {
  const services = [
    {
      title: "Airport Transfers",
      description:
        "Experience seamless airport transfers with our premium service. We ensure punctual arrivals and departures, handling your journey with precision and comfort. Our professional chauffeurs monitor flight times and adjust for any changes.",
      image: lexu,
      icon: <MapPin className="w-6 h-6" />,
      features: [
        "Flight monitoring",
        "Meet & greet service",
        "24/7 availability",
      ],
    },
    {
      title: "Special Events",
      description:
        "Make your special occasions truly memorable with our luxury transportation services. From weddings to corporate events, we provide sophisticated vehicles and professional chauffeurs to enhance your experience.",
      image: lambo,
      icon: <Calendar className="w-6 h-6" />,
      features: [
        "Event coordination",
        "Multiple vehicle options",
        "Professional uniformed drivers",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Premium Services</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience luxury transportation tailored to your needs with our
            comprehensive range of premium services
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
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0  transition-opacity duration-500" />
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
                  Book Now
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
