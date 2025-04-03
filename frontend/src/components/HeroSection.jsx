import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import lexu from "../assets/fleet1.png";
import lambo from "../assets/fleet2.png";
import fera from "../assets/fleet4.png";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: lexu,
      title: "Mercedes AMG GT",
      mainText: "Drive the change",
      subText: "with us!",
      description: "Our platform bridges car owners and renters, offering a seamless peer-to-peer car rental experience built on trust, flexibility, and innovation.",
    },
    {
      url: fera,
      title: "BMW M8 Gran Coupe",
      mainText: "Where car owners",
      subText: "and renters meet",
      description: "We create opportunities for shared mobility, offering secure, cost-effective, and efficient car rental solutions for everyone.",
    },
    {
      url: lambo,
      title: "Porsche Panamera",
      mainText: "Your car,",
      subText: "their journey",
      description: "Our platform ensures a smooth connection between owners and renters, fostering shared mobility with trust and ease.",
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
    <div className="bg-gray-100">
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
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
                <div className="text-center text-white max-w-4xl px-4">
                  <div className="space-y-2 mb-4 md:mb-6">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
                      {car.mainText}
                    </h1>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                      {car.subText}
                    </h1>
                  </div>
                  <p className="text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90 px-4">
                    {car.description}
                  </p>
                  <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4">
                 <Link to="/createVehicles">
                 <button className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-gray-100 transition-all">
                      List Your Car
                    </button>
                 </Link>
                    <Link to="/fleet">
                    <button className="bg-transparent text-white border-2 border-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:text-black transition-all">
                      Rent a Car
                    </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between sm:bottom-auto sm:top-1/2 sm:transform sm:-translate-y-1/2">
          <button
            onClick={prevSlide}
            className="bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;