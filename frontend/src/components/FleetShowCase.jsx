import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import lexu from "../assets/fleet1.png";
import lambo from "../assets/fleet2.png";
import fera from "../assets/fleet3.png";
import fleet4 from "../assets/fleet4.png";
import fleet5 from "../assets/fleet5.png";
import fleet6 from "../assets/fleet6.png";
import fleet7 from "../assets/fleet7.png";

const FleetShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ["All", "Luxury", "Business", "Weddings", "Crossover"];

  const fleet = [
    {
      id: 1,
      name: "Lexus LX",
      image: lexu,
      passengers: 7,
      luggage: 4,
      category: "Luxury",
      description: "Premium SUV with exceptional comfort",
    },
    {
      id: 2,
      name: "Lamborghini Aventador",
      image: lambo,
      passengers: 2,
      luggage: 2,
      category: "Sport",
      description: "Supercar with stunning performance",
    },
    {
      id: 3,
      name: "Ferrari F8",
      image: fera,
      passengers: 2,
      luggage: 2,
      category: "Sport",
      description: "Italian excellence in performance",
    },
    {
      id: 4,
      name: "Mercedes S-Class",
      image: fleet4,
      passengers: 5,
      luggage: 3,
      category: "Business",
      description: "Ultimate luxury sedan",
    },
    {
      id: 5,
      name: "BMW X7",
      image: fleet5,
      passengers: 6,
      luggage: 4,
      category: "Crossover",
      description: "Spacious luxury SUV",
    },
    {
      id: 6,
      name: "Rolls-Royce Ghost",
      image: fleet6,
      passengers: 4,
      luggage: 3,
      category: "Luxury",
      description: "Peak of automotive luxury",
    },
    {
      id: 7,
      name: "Range Rover",
      image: fleet7,
      passengers: 5,
      luggage: 4,
      category: "Crossover",
      description: "Versatile luxury SUV",
    },
  ];

  const filteredFleet =
    activeCategory === "All"
      ? fleet
      : fleet.filter((car) => car.category === activeCategory);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= filteredFleet.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, filteredFleet.length - 3) : prevIndex - 3
    );
  };

  const visibleCars = filteredFleet.slice(currentIndex, currentIndex + 3);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Exceptional Fleet</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our curated collection of premium vehicles, from luxurious
            sedans to powerful sports cars
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentIndex(0);
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeCategory === category
                      ? "bg-black text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-contain rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <p className="text-gray-600 text-sm">{car.description}</p>
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        <span>{car.passengers} </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🧳</span>
                        <span>{car.luggage} </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium">
                      {car.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFleet.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-black text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-black text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(filteredFleet.length / 3) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 3) === index
                    ? "bg-black w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetShowcase;
