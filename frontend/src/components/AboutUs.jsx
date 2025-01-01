import React from "react";
import carAbout from "../assets/car-about.png";
import mercedes from "../assets/mercedes.png";
import reserve from "../assets/reserve.png";

const AboutUs = () => {
  const features = [
    {
      title: "Quality & Safety",
      description:
        "Discover our dedication to excellence as we uphold the strictest quality and safety standards. Every vehicle in our exceptional fleet undergoes rigorous maintenance checks and thorough cleanings, ensuring peak performance and safety. Our meticulous attention to detail guarantees a secure and comfortable journey.",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Affordable Rates",
      description:
        "We ensure that every level of our services provides excellent value for the cost. Our transparent pricing model ensures no hidden fees or surprise charges. We believe in making premium car rentals accessible without compromising on service quality, offering competitive rates that benefit you.",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Easy Booking",
      description:
        "We've streamlined our rental process to make booking your desired vehicle effortless. Through our user-friendly platform, you can browse our fleet, compare options, and secure your reservation in minutes. Our efficient booking system ensures a seamless experience from start to finish.",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Customer Satisfaction",
      description:
        "Your satisfaction drives our commitment to excellence. We take pride in our responsive customer service team, ready to assist you at every step. From initial inquiry to vehicle return, we ensure your experience exceeds expectations, backed by our dedication to customer-first service.",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="pb-12 pt-[3rem]">
        <h1 className="text-4xl font-bold text-center mb-8">Who We are</h1>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={carAbout}
            alt="Woman driving car"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center py-6 px-4 bg-gray-50 rounded-lg">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
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
              src={mercedes}
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

      {/* Updated Why Choose Section with Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose CarHive?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                  <feature.icon />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="bg-black rounded-3xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
            <div className="z-10 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                List your vehicle & earn or <br />
                book your Dream Car Today
              </h2>
              <button className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors">
                Reserve Now
              </button>
              <button className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors">
                Our Fleets
              </button>
            </div>

            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10 md:opacity-20">
              <img
                src={reserve}
                alt="Woman driving car"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
