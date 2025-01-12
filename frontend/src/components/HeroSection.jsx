import React, { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import lexu from "../assets/fleet1.png";
import lambo from "../assets/fleet2.png"
import fera from "../assets/fleet4.png"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: lexu,
      title: "Mercedes AMG GT",
      description: "Drive the change with us! Our platform bridges car owners and renters, offering a seamless peer-to-peer car rental experience built on trust, flexibility, and innovation.",
    },
    {
      url: fera,
      title: "BMW M8 Gran Coupe",
      description: "Where car owners and renters meet. We create opportunities for shared mobility, offering secure, cost-effective, and efficient car rental solutions for everyone.",
    },
    {
      url: lambo,
      title: "Porsche Panamera",
      description: "Your car, their journey—our platform ensures a smooth connection between owners and renters, fostering shared mobility with trust and ease.",
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
      <div className=" bg-gray-100">
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

        </div>
      </div>
    </>
  );
};

export default HeroSection;
