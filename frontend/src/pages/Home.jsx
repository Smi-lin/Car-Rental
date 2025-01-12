import React from "react";
import HeroSection from "../components/HeroSection";
import Service from "../components/Service";
import FleetShowcase from "../components/FleetShowCase";
import ChooseUs from "../components/ChooseUs";
import SubscriptionForm from "../components/SubscriptionForm";


const Home = () => {
  return (
    <div className="flex flex-col ">
      <HeroSection />
      <div className=" border-t-2 p-4 bg-gradient-to-b from-green-50 to-white ">
      <Service/>
      <FleetShowcase/>
      <ChooseUs/>
      <SubscriptionForm/>
      </div>
    </div>
  );
};

export default Home;
