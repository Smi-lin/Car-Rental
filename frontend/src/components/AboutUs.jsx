import React from "react";
import woman from "../assets/woman.jpg";
import reserve from "../assets/reserve.png";
import Ferrari from "../assets/logo1.jpg";
import Bmw from "../assets/logo2.jpg";
import Lexus from "../assets/logo3.jpg";
import Camry from "../assets/logo4.jpg";
import logo5 from "../assets/logo5.jpg";
import logo6 from "../assets/logo6.jpg";
import fleet6 from "../assets/fleet6.png";

const AboutUs = () => {
  const features = [
    {
      url: Ferrari,
      title: "Trust & Security",
      description:
        "We prioritize the safety of both car owners and renters through comprehensive verification processes. Every listed vehicle undergoes thorough inspection, and all users are verified for identity and driving history. Our platform includes insurance coverage and 24/7 support for peace of mind.",
    },
    {
      url: Bmw,
      title: "Competitive Earnings & Rates",
      description:
        "Car owners can maximize their vehicle's earning potential with our dynamic pricing model, while renters enjoy competitive rates below traditional rental companies. Our transparent fee structure means no hidden charges for either party, creating a win-win marketplace.",
    },
    {
      url: Lexus,
      title: "Seamless Platform",
      description:
        "Our user-friendly platform makes it simple for owners to list their vehicles and manage bookings, while renters can easily browse, compare, and book cars. The streamlined process includes secure messaging, digital contracts, and contactless key exchange options.",
    },
    {
      url: Camry,
      title: "Community Success",
      description:
        "We're built on the success of our community members. Our dedicated support team assists both owners and renters throughout their journey. From listing optimization for owners to 24/7 roadside assistance for renters, we ensure everyone's success on our platform.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="pb-8 sm:pb-12 pt-[2rem] sm:pt-[3rem]">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">
          Who We Are
        </h1>
        <div className="relative h-48 sm:h-64 md:h-96 rounded-lg overflow-hidden mb-6 sm:mb-8">
          <img
            src={woman}
            alt="Woman driving car"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap justify-center sm:justify-between items-center py-4 sm:py-6 px-2 sm:px-4 bg-gray-50 rounded-lg gap-4">
          {[Ferrari, Bmw, Lexus, Camry, logo5, logo6].map((logo, index) => (
            <div key={index} className="flex items-center space-x-2">
              <img
                src={logo}
                alt={`Logo ${index + 1}`}
                className="w-[3rem] sm:w-[5rem] h-[2.5rem] sm:h-[4rem] rounded-full object-cover"
              />
              <span className="text-xs sm:text-sm text-gray-600">Logipsum</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4">
              <div className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                JOIN OUR COMMUNITY!
              </div>
            </div>
            <img
              src={fleet6}
              alt="Premium red car"
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="text-xs sm:text-sm text-gray-600">OUR STORY</div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Revolutionizing Car Sharing
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              CarHive began with a simple vision: to create a trusted community
              where car owners can monetize their vehicles and where people seeking
              cars can find the perfect ride. We've built a secure platform that
              connects vehicle owners with qualified renters, enabling seamless car
              sharing experiences. Our commitment to trust, safety, and community
              has made us a leading marketplace for peer-to-peer car sharing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Why Choose CarHive?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Join our thriving community of car owners and renters, where trust
            meets convenience
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={feature.url}
                    alt={feature.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="bg-black rounded-3xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 md:p-16">
            <div className="z-10 space-y-4 sm:space-y-6 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                Start earning as an owner or find your perfect rental today
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  List Your Car
                </button>
                <button className="bg-transparent text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium border-2 border-white hover:bg-white hover:text-black transition-colors">
                  Browse Cars
                </button>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <img
                src={reserve}
                alt="Luxury vehicle"
                className="opacity-20 md:opacity-30"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;