import { useMemo } from "react";
import useSignerOrProvider from "./useSignerOrProvider";
import { Contract } from "ethers";
import ABI1 from "../ABI/carHive.json";
import ABI2 from "../ABI/carOwner.json";
import ABI3 from "../ABI/rentee.json";

// Contract configurations
const CONTRACTS = {
  CONTRACT1: {
    abi: ABI1,
    address: process.env.CONTRACTCARHIVE_ADDRESS
  },
  CONTRACT2: {
    abi: ABI2,
    address: process.env.CONTRACTCAROWNER_ADDRESS
  },
  CONTRACT3: {
    abi: ABI3,
    address: process.env.CONTRACTRENTEE_ADDRESS
  }
};

const useContractInstance = (contractType, withSigner = false) => {
  const { signer, readOnlyProvider } = useSignerOrProvider();

  return useMemo(() => {
    // Get contract config
    const contractConfig = CONTRACTS[contractType];
    if (!contractConfig) {
      throw new Error(`Invalid contract type: ${contractType}`);
    }
    

    const { abi, address } = contractConfig;

    if (withSigner) {
      if (!signer) return null;
      return new Contract(address, abi, signer);
    }

    return new Contract(address, abi, readOnlyProvider);
  }, [contractType, signer, readOnlyProvider, withSigner]);
};

export default useContractInstance;