import React, { useEffect, useState } from "react";

interface WalletContextProps {
  walletAddress: string | null;
  walletName: string | null;
  disconnectWallet: Function;
  connectWallet: Function;
}
export const WalletContext = React.createContext<WalletContextProps>({
  walletAddress: "",
  walletName: "",
  disconnectWallet: () => {},
  connectWallet: () => {},
});

const WalletProvider = (props: any) => {
  const [walletAddress, setWalletAddress] = useState<string | null>("");
  const [walletName, setWalletName] = useState<string | null>("");

  const checkIfWalletConnected = async () => {
    
  };

  const disconnectWallet = async () => {
    
  };

  const connectWallet = async (walletName: string, connect: Function) => {
    
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletName,
        disconnectWallet,
        connectWallet,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
