import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import lexu from "../assets/fleet3.png";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How does the car listing process work?",
      answer:
        "As a car owner, you can list your vehicle by creating an account, uploading photos and details of your car, setting availability and pricing. Our team will verify your vehicle's information and documentation. Once approved, your car will be visible to potential renters on our platform.",
    },
    {
      question: "What protection do owners and renters get?",
      answer:
        "We provide comprehensive insurance coverage for both parties during the rental period. Car owners are protected against damage and theft, while renters receive liability coverage. Additionally, we verify all users' identities, driving histories, and maintain a secure payment system.",
    },
    {
      question: "How does the payment process work?",
      answer:
        "Renters pay through our secure platform when booking a car. Owners receive payments automatically after each completed rental, minus our service fee. We hold the payment for 24 hours after the rental ends to ensure everything is satisfactory. Direct deposits are made to the owner's registered bank account.",
    },
    {
      question: "What happens if there's a problem during the rental?",
      answer:
        "Both parties have access to 24/7 support. For mechanical issues, we provide roadside assistance. In case of accidents, our insurance process will guide both parties. We also have a dispute resolution system to handle any disagreements between owners and renters.",
    },
    {
      question: "How are rental prices determined?",
      answer:
        "Car owners set their base daily rates. Our platform provides pricing recommendations based on your car's make, model, year, and local market conditions. Renters may see different final prices based on duration, season, and demand. We add a service fee to protect both parties.",
    },
    {
      question: "What are the requirements for listing or renting a car?",
      answer:
        "Car owners must have a vehicle less than 15 years old with valid registration and insurance. Renters must be at least 21 years old, have a valid driver's license, clean driving record, and pass our verification process. International renters may need additional documentation.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Find answers to common questions about car sharing on our platform
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
              Need More Information?
            </h2>
            <p className="text-gray-600">WE'RE HERE TO HELP OWNERS AND RENTERS</p>
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors">
              Contact Support
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