import React from "react";
import woman from "../assets/woman.jpg";
import reserve from "../assets/reserve.png";
import logo1 from "../assets/logo1.jpg";
import logo2 from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";
import logo4 from "../assets/logo4.jpg";
import logo5 from "../assets/logo5.jpg";
import logo6 from "../assets/logo6.jpg";
import fleet6 from "../assets/fleet6.png"

const AboutUs = () => {
  const features = [
    {
      url: logo1,
      title: "Quality & Safety",
      description:
        "Discover our dedication to excellence as we uphold the strictest quality and safety standards. Every vehicle in our exceptional fleet undergoes rigorous maintenance checks and thorough cleanings, ensuring peak performance and safety. Our meticulous attention to detail guarantees a secure and comfortable journey.",
    },
    {
      url: logo2,
      title: "Affordable Rates",
      description:
        "We ensure that every level of our services provides excellent value for the cost. Our transparent pricing model ensures no hidden fees or surprise charges. We believe in making premium car rentals accessible without compromising on service quality, offering competitive rates that benefit you.",
    },
    {
      url: logo3,
      title: "Easy Booking",
      description:
        "We've streamlined our rental process to make booking your desired vehicle effortless. Through our user-friendly platform, you can browse our fleet, compare options, and secure your reservation in minutes. Our efficient booking system ensures a seamless experience from start to finish.",
    },
    {
      url: logo4,
      title: "Customer Satisfaction",
      description:
        "Your satisfaction drives our commitment to excellence. We take pride in our responsive customer service team, ready to assist you at every step. we ensure your experience exceeds expectations, backed by our dedication to customer-first service.",
    },
    
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="pb-12 pt-[3rem]">
        <h1 className="text-4xl font-bold text-center mb-8">Who We are</h1>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={woman}
            alt="Woman driving car"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center py-6 px-4 bg-gray-50 rounded-lg">
          {[logo1, logo2, logo3, logo4, logo5, logo6].map((logo, index) => (
            <div key={index} className="flex items-center space-x-2">
              <img
                src={logo}
                alt={`Logo ${index + 1}`}
                className="w-[5rem] h-[4rem] rounded-full object-cover"
              />
              <span className="text-sm text-gray-600">Logipsum</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">
                PICK THE CAR!
              </div>
            </div>
            <img
              src={fleet6}
              alt="Premium red car"
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          <div className="space-y-6">
            <div className="text-sm text-gray-600">OUR JOURNEY</div>
            <h2 className="text-3xl font-bold">
              Pioneering Premium Car Rentals
            </h2>
            <p className="text-gray-600 leading-relaxed">
              CarHive embarked on a remarkable journey committed to achieving an
              excellent position for redefining the travel experience. From the
              outset, our mission has been clear: to provide exceptional and
              exceptional service to make every journey unforgettable. We've
              upheld our commitment to premium quality and safety, offering a
              diverse range of meticulously maintained vehicles to cater to
              every preference and requirement.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why Choose CarHive?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our premium services and exceptional standards
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
               <div className="flex items-start gap-6">
               <div className="flex-shrink-0">
                  <img 
                    src={feature.url}
                    alt={feature.title}
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center"
                  />
                </div>
                <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-black rounded-3xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between p-12 md:p-16">
            <div className="z-10 space-y-6 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                List your vehicle & earn or book your Dream Car Today
              </h2>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors">
                  Reserve Now
                </button>
                <button className="bg-transparent text-white px-8 py-4 rounded-full font-medium border-2 border-white hover:bg-white hover:text-black transition-colors">
                  View Fleet
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
