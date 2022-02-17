import React, { useContext, useEffect, useState } from "react"
import * as nearAPI from "near-api-js"
import { ConnectionContext } from "./connection"

interface ContractContextProps {
  contract: any
}

export const ContractContext = React.createContext<ContractContextProps>({
  contract: undefined,
})

const ContractProvider = (props: any) => {
  const [contract, setContract] = useState<nearAPI.Contract>()
  const { wallet } = useContext(ConnectionContext)

  useEffect(() => {
    if (!wallet) return
    const contract = new nearAPI.Contract(
      wallet.account(),
      "marketplace_test_2.xuguangxia.testnet",
      {
        viewMethods: [],
        changeMethods: ["add_collection"],
        // sender: wallet.account(),
      }
    )
    setContract(contract)
  }, [wallet])

  return (
    <ContractContext.Provider value={{ contract }}>
      {props.children}
    </ContractContext.Provider>
  )
}

export default ContractProvider
