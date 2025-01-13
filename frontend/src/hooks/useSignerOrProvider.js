import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { readOnlyProvider } from "../constants/readOnlyProvider";

const useSignerOrProvider = () => {
  const [signer, setSigner] = useState();

  const { walletProvider } = useAppKitProvider("eip155");

  const provider = useMemo(
    () => (walletProvider ? new BrowserProvider(walletProvider) : null),
    [walletProvider]
    
  );
  console.log("Wallet Provider:", walletProvider);
  console.log("Provider:", provider);

  // provider.getNetwork().then((network) => {
  //   console.log("Connected Network:", network.chainId);
  // });

  useEffect(() => {
    if (!provider) return setSigner(null);

    provider.getSigner().then((newSigner) => {
      if (!signer) return setSigner(newSigner);
      if (newSigner.address === signer.address) return;
      setSigner(newSigner);
    });
  }, [provider, signer]);
  useEffect(() => {
    if (!provider || !signer) return;
    provider.getBalance(signer.address).then((balance) => {
      console.log("Wallet Balance:", balance.toString());
    });
  }, [provider, signer]);

  return { signer, provider, readOnlyProvider };
};

export default useSignerOrProvider;
