import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import lexus from "../assets/lexus.png";
import mercedes from "../assets/mercedes.png";
import suv from "../assets/suv.png";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: lexus,
      title: "Mercedes AMG GT",
      description: "Experience luxury and performance",
    },
    {
      url: mercedes,
      title: "BMW M8 Gran Coupe",
      description: "Ultimate driving machine",
    },
    {
      url: suv,
      title: "Porsche Panamera",
      description: "Sports car comfort",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="relative h-[600px] overflow-hidden">
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((car, index) => (
              <div key={index} className="relative w-full h-full flex-shrink-0">
                <div className="absolute inset-0 bg-black/50"></div>
                <img
                  src={car.url}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">
                      Premium car rental
                    </h1>
                    <p className="text-xl mb-8">{car.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <FaArrowRight />
          </button>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-Up Address
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="From address, airport, hotel..."
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-Up Date
                  </label>
                  <div className="relative">
                    <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-Up Time
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="time"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
