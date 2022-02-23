import React, { useContext, useEffect, useState } from "react"
import * as nearAPI from "near-api-js"
import { ConnectionContext } from "./connection"

interface ContractContextProps {
  contract: any
  contractAccountId: string
}

export const ContractContext = React.createContext<ContractContextProps>({
  contract: undefined,
  contractAccountId: "",
})

const ContractProvider = (props: any) => {
  const [contract, setContract] = useState<nearAPI.Contract>()
  const { wallet } = useContext(ConnectionContext)
  const contractAccountId = "marketplace_test_9.xuguangxia.testnet"

  useEffect(() => {
    if (!wallet) return
    const contract = new nearAPI.Contract(wallet.account(), contractAccountId, {
      viewMethods: [
        "get_collection",
        "get_collections",
        "get_sale",
        "get_sales_by_nft_contract_id",
      ],
      changeMethods: [
        "add_collection",
        "edit_collection",
        "delete_collection",
        "remove_sale",
        "offer",
        "accept_offer",
        "update_price",
      ],
      // sender: wallet.account(),
    })
    setContract(contract)
  }, [wallet])

  return (
    <ContractContext.Provider value={{ contract, contractAccountId }}>
      {props.children}
    </ContractContext.Provider>
  )
}

export default ContractProvider
