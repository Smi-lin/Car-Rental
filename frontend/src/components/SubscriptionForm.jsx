import React, { useState } from "react";

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-wide">
          Subscribe and get 20% off
          <br />
          your first rental.
        </h2>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              Submit
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          By subscribing, you agree to receive marketing communications from us.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionForm;
