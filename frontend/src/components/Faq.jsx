import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import lexu from "../assets/fleet3.png";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "To rent a car, you'll need a valid driver's license, proof of insurance, a credit card for the security deposit, and a valid ID. International customers may need additional documentation including an International Driving Permit.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Our standard cancellation policy allows free cancellation up to 24 hours before your scheduled pickup. Cancellations made within 24 hours may be subject to a fee. Special rates and promotions may have different cancellation terms.",
    },
    {
      question: "Is insurance included in the rental price?",
      answer:
        "Basic insurance is included in the rental price. However, we offer additional coverage options for complete peace of mind. This includes collision damage waiver, theft protection, and personal accident insurance.",
    },
    {
      question: "Can I modify my reservation?",
      answer:
        "Yes, you can modify your reservation up to 24 hours before pickup through our website or by contacting our customer service. Changes may affect the rental rate and are subject to vehicle availability.",
    },
    {
      question: "What is your fuel policy?",
      answer:
        "Our vehicles are provided with a full tank of fuel and should be returned with a full tank. If the vehicle is not returned with a full tank, a refueling fee will be applied based on current market rates plus a service charge.",
    },
    {
      question: "Do you offer long-term rentals?",
      answer:
        "Yes, we offer special rates for long-term rentals exceeding 30 days. These rentals come with additional benefits including maintenance services and flexible mileage packages. Contact us for customized quotes.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Find answers to common questions about our car rental services
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-left">{faq.question}</span>
              {openIndex === index ? (
                <IoIosArrowUp className="w-5 h-5 text-gray-500" />
              ) : (
                <IoIosArrowDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-red-50 rounded-3xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
          <div className="z-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Still Have Questions?
            </h2>
            <p className="text-gray-600">CONTACT US FOR TOP ASSISTANCE</p>
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors">
              Contact Us
            </button>
          </div>

          <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
            <img
              src={lexu}
              alt="Premium red car"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
