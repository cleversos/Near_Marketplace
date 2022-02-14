import React, { useContext, useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { ConnectionContext } from "./connection";

interface ContractContextProps {
  contract: any;
}

export const ContractContext = React.createContext<ContractContextProps>({
  contract: undefined,
});

const ContractProvider = (props: any) => {
  const [contract, setContract] = useState<nearAPI.Contract>();
  const { wallet } = useContext(ConnectionContext);

  useEffect(() => {
    if (!wallet) return;
    const contract = new nearAPI.Contract(
      wallet.account(),
      "example-contract.testnet",
      {
        viewMethods: [],
        changeMethods: ["addCollection"],
        // sender: wallet.account(),
      }
    );
    console.log({ contract });
    setContract(contract);
  }, [wallet]);

  return (
    <ContractContext.Provider value={{ contract }}>
      {props.children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;
