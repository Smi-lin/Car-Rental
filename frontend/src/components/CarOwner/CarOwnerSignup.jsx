import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const animStar = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
`;

const generateBoxShadows = (n, size) => {
  let boxShadows = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    boxShadows.push(`${x}px ${y}px #FFF`);
  }
  return boxShadows.join(', ');
};

const StarsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
`;

const Stars = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: transparent;
  box-shadow: ${props => generateBoxShadows(props.count, props.size)};
  animation: ${animStar} ${props => props.duration}s linear infinite;

  &:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    background: transparent;
    box-shadow: ${props => generateBoxShadows(props.count, props.size)};
  }
`;

const StarsBackground = () => (
  <StarsContainer>
    <Stars size={1} count={700} duration={50} />
    <Stars size={2} count={200} duration={100} />
    <Stars size={3} count={100} duration={150} />
  </StarsContainer>
);

const CarOwnerSignUp = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();  

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/carowner-dashboard');  
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const LoaderText = ({ text }) => {
    return (
      <div className="flex">
        {text.split('').map((char, idx) => (
          <span
            key={idx}
            className="text-[#faebd7] animate-[loading_1s_ease-in-out_infinite_alternate]"
            style={{
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    );
  };

  return (
    
    <div>
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <StarsBackground />
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden z-10">
        <div className="bg-black/80 text-white p-8 text-center">
          <h1 className="font-['Josefin_Sans'] text-5xl mb-2 tracking-wider text-[#03dac6] transition-all duration-300 hover:transform hover:-translate-y-2 hover:text-[#ff0266] z-10">
            Welcome to CarHive
          </h1>
          <h3 className="text-2xl tracking-wider font-light text-[#faebd7] z-10">
            <LoaderText text="Your premier destination for luxury and performance vehicles" />
          </h3>
        </div>

        <div className="p-8 md:p-12 bg-white/80 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
          

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 flex items-center justify-center relative">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">👤</div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="bg-[#6470f5] text-white px-4 py-2 rounded-lg  transition-all duration-300">
                    Choose Profile Picture
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#03dac6] focus:border-transparent outline-none transition bg-white/80"
                  placeholder="Enter your Username"
                />
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Gender
                </label>
                <div className="flex gap-8">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="mr-3 h-5 w-5 text-[#03dac6] focus:ring-[#03dac6]"
                    />
                    <span className="text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="mr-3 h-5 w-5 text-[#03dac6] focus:ring-[#03dac6]"
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6470f5] text-white py-4 px-6 rounded-lg transition-all duration-300 font-medium text-lg mt-8 transform hover:-translate-y-1"
              >
               Register As a Car Owner
              </button>

              <div className="space-y-4 pt-6">
              

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CarOwnerSignUp;