import { useMemo } from "react";
import useSignerOrProvider from "./useSignerOrProvider";
import { Contract } from "ethers";
// import ABI from "../ABI/multisig.json";
import ABI from "../ABI/rentee.json"

const useContractInstance = (withSigner = false) => {
  const { signer, readOnlyProvider } = useSignerOrProvider();

  return useMemo(() => {
    if (withSigner) {
      if (!signer) return null;
      return new Contract(
        process.env.REACT_APP_CONTRACTRENTEE_ADDRESS,
        ABI,
        signer
      );
    }

    return new Contract(
        process.env.REACT_APP_CONTRACTRENTEE_ADDRESS,
      ABI,
      readOnlyProvider
    );
  }, [signer, readOnlyProvider, withSigner]);
};

export default useContractInstance;
