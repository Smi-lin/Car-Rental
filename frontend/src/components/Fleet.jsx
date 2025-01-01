import React from "react";
import { FaStar, FaMapMarkerAlt, FaCar } from "react-icons/fa";
import lexus from '../assets/lexus.png';
import mercedes from '../assets/mercedes.png';
import suv from '../assets/suv.png';

const Fleet = () => {
  const cars = [
    {
      name: "Mercedes",
      transmission: "Automatic/Manual",
      location: "Lagos",
      year: "2015",
      rating: "3/5",
      price: 5,
      image: mercedes
    },
    {
      name: "Lexus",
      transmission: "Manual",
      location: "Lagos",
      year: "2015",
      rating: "3/5",
      price: 50,
      image: suv
    },
    {
      name: "SUV",
      transmission: "Automatic",
      location: "Kwara",
      year: "2015",
      rating: "1/5",
      price: 15,
      image: suv
    },
    {
      name: "Benz",
      transmission: "Automatic",
      location: "Lagos",
      year: "2015",
      rating: "3/5",
      price: 23,
      image: mercedes
    },
    {
      name: "Camry",
      transmission: "Manual",
      location: "Abuja",
      year: "2015",
      rating: "4/5",
      price: 30,
      image: mercedes
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
     <div>
      <h1 className="text-[5rem] text-center text-blue-500">Our Collections</h1>
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
                  <span className="text-gray-900 font-semibold">${car.price}/Hrs</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
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
  );
};

export default Fleet;