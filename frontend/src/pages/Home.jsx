import React from "react";
import HeroSection from "../components/HeroSection";
import RenteeService from "../components/RenteeService";
import CarOwnerService from "../components/CarOwnerService";


const Home = () => {
  return (
    <div className="flex flex-col ">
      <HeroSection />
      <div className=" border-t-2 p-4 bg-gradient-to-b from-green-50 to-white ">
      <CarOwnerService/>
       <RenteeService/>
      </div>
    </div>
  );
};

export default Home;
