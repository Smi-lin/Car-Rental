import React from "react";
import { FaStar, FaMapMarkerAlt, FaCar, FaSearch } from "react-icons/fa";
import lexu from "../assets/fleet1.png";
import lambo from "../assets/fleet2.png";
import fera from "../assets/fleet9.png";

const Fleet = () => {
  const cars = [
    {
      name: "Mercedes",
      transmission: "Automatic/Manual",
      location: "Lagos",
      year: "2015",
      rating: "3/5",
      price: 5,
      image: lexu,
    },
    {
      name: "Lexus",
      transmission: "Manual",
      location: "Lagos",
      year: "2015",
      rating: "3/5",
      price: 50,
      image: lambo,
    },
    {
      name: "SUV",
      transmission: "Automatic",
      location: "Kwara",
      year: "2015",
      rating: "1/5",
      price: 15,
      image: fera,
    },
    {
      name: "Benz",
      transmission: "Automatic",
      location: "Lagos",
      year: "2015",
      rating: "3/5",
      price: 23,
      image: lambo,
    },
    {
      name: "Camry",
      transmission: "Manual",
      location: "Abuja",
      year: "2015",
      rating: "4/5",
      price: 30,
      image: fera,
    },
  ];

  return (
    <>
      <div className="flex justify-center items-center gap-4 my-6">
        <div className="relative w-[40vw]">
          <input
            type="text"
            placeholder="Search cars..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            size={20}
          />
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Search
        </button>
      </div>

      <div className="bg-gray-50 min-h-screen py-12">
        <div>
          <h1 className="text-[5rem] text-center text-blue-500">
            Our Collections
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-gray-900 font-semibold">
                      ${car.price}/Hrs
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.name}
                    </h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {car.transmission}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                        <span>{car.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCar className="w-4 h-4 text-gray-400" />
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium">{car.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Fleet;
