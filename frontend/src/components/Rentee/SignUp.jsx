import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import useRegisterAsRentee from "../../hooks/useRegisterAsRentee";

import { siweConfig } from "../../config/siwe";
import { BrowserProvider, JsonRpcSigner } from "ethers";

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
  return boxShadows.join(", ");
};

const StarsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
`;

const Stars = styled.div`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: transparent;
  box-shadow: ${(props) => generateBoxShadows(props.count, props.size)};
  animation: ${animStar} ${(props) => props.duration}s linear infinite;

  &:after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    background: transparent;
    box-shadow: ${(props) => generateBoxShadows(props.count, props.size)};
  }
`;

const StarsBackground = () => (
  <StarsContainer>
    <Stars size={1} count={700} duration={50} />
    <Stars size={2} count={200} duration={100} />
    <Stars size={3} count={100} duration={150} />
  </StarsContainer>
);

const SignUp = () => {
  const createAccount = useRegisterAsRentee();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [imageHash, setImageHash] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initialize SIWE config with Base Sepolia
  const supportedChains = [
    {
      id: 84532, // Base Sepolia chain ID
      name: "Base Sepolia",
    },
  ];
  const siwe = siweConfig(supportedChains);

  const checkNetwork = async (provider) => {
    const network = await provider.getNetwork();
    if (network.chainId !== 84532n) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }], // 84532 in hex
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x14a34",
                  chainName: "Base Sepolia",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.base.org"],
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
          } catch (addError) {
            throw new Error("Failed to add Base Sepolia network to MetaMask");
          }
        }
        throw new Error("Failed to switch to Base Sepolia network");
      }
    }
  };

  const handleRegister = async () => {
    // if (!userName || !imageHash) {
    //   toast.error("Please fill all fields and upload required files.");
    //   return;
    // }

    // setIsUploading(true);
    setIsUploading(true);
    try {
      await createAccount(userName, imageHash);
    } catch (error) {
      console.error("Error while signing up:", error);
      toast.error("An error occurred while creating your account.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !imageHash) {
      toast.error("Please fill all fields and upload required files.");
      return;
    }

    setIsAuthenticating(true);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to continue!");
      }
      const provider = new BrowserProvider(window.ethereum);

      await checkNetwork(provider);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      if (chainId !== 84532) {
        throw new Error("Please switch to Base Sepolia network");
      }

      const messageParams = await siwe.getMessageParams();

      const message = siwe.createMessage({
        address,
        chainId,
        ...messageParams,
      });

      const signature = await signer.signMessage(message);

      const verified = await siwe.verifyMessage({ message, signature });

      if (!verified) {
        throw new Error("Signature verification failed");
      }

      const session = await siwe.getSession();

      if (!session) {
        throw new Error("Failed to establish session");
      }

      await handleRegister();

      
    } catch (error) {
      console.error("Authentication Error:", error);
      toast.error(error.message || "Authentication failed");

      try {
        await siwe.signOut();
      } catch (signOutError) {
        console.error("Sign out error:", signOutError);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImageHash(selectedFile);
    console.log(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // const handleRegister = async () => {
  //   if (!userName || !imageHash) {
  //     toast.error("Please fill all fields and upload required files.");
  //     return;
  //   }

  //   setIsUploading(true);
  //   try {

  //     await createAccount(userName, imageHash);

  //   } catch (error) {
  //     console.error("Error while signing up:", error);
  //     toast.error("An error occurred while creating your account.");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const LoaderText = ({ text }) => {
    return (
      <div className="flex">
        {text.split("").map((char, idx) => (
          <span
            key={idx}
            className="text-[#faebd7] animate-[loading_1s_ease-in-out_infinite_alternate]"
            style={{
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
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
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Create Your Account
              </h2>
              <p className="text-gray-600 mb-8">
                Join CarHive and discover your perfect vehicle
              </p>

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
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
                  className={`w-full sm:w-[15vw] ${
                    isUploading || isAuthenticating
                      ? "bg-gray-400"
                      : "bg-[#F5A624]"
                  } text-white py-3 rounded-lg hover:bg-[#e69816] transition-colors `}
                  type="submit"
                  disabled={isUploading || isAuthenticating}
                >
                  {isAuthenticating
                    ? "Registration On going ...."
                    : isAuthenticating
                    ? "Uploading..."
                    : "Create Account"}
                </button>

                <div className="space-y-4 pt-6">
                  <div className="text-center text-gray-600">
                    <span>Want to list your car? </span>
                    <Link
                      to="/carownerSignup"
                      className="text-[#03dac6] font-medium  transition-colors duration-300"
                    >
                      Sign Up as a Car Owner
                    </Link>
                  </div>

                  <div className="text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-[#03dac6] font-medium hover:text-[#ff0266] transition-colors duration-300"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
