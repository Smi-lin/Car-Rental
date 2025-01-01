import React from "react";
import suv from "../assets/suv.png";

const RenteeService = () => {
  const services = [
    {
      title: "Airport transfers",
      description:
        "With additional wait time and flight tracking in case of delays, our service is optimized to make every airport transfer seamless.",
      image: suv,
    },
    {
      title: "Intercity trips",
      description:
        "Your attractive solution for traveling between cities with chauffeurs all over the world.",
      image: suv,
    },
    {
      title: "Wedding events",
      description:
        "Get a professional chauffeur service combined with thorough attention to detail ensure you can truly relax and enjoy your special day.",
      image: suv,
    },
    {
      title: "Business Meeting",
      description:
        "Whether you're going to job partners, forget about the road and the car, which will disturb your thoughts.",
      image: suv,
    },
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Rentee Services</h2>
          <p className="text-gray-600">
            We invite you to try our services, and we personally guarantee that
            you will be completely satisfied.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RenteeService;
