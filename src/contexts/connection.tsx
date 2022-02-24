import * as nearAPI from "near-api-js"
import {
  ConnectConfig,
  providers,
  WalletConnection as WalletConnectionProps,
} from "near-api-js"
import { Provider } from "near-api-js/lib/providers"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import * as buffer from "buffer"
  ; (window as any).Buffer = buffer.Buffer

const { connect, keyStores, WalletConnection } = nearAPI

const configs: ConnectConfig[] = [
  {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    // explorerUrl: "https://explorer.testnet.near.org",
    headers: {},
  },
]

interface ConnectionContextProps {
  near: nearAPI.Near | undefined
  wallet: WalletConnectionProps | undefined
  network: string
  provider: Provider | undefined
  setNetwork: Function
  signIn: Function
  signOut: Function
}

export const ConnectionContext = React.createContext<ConnectionContextProps>({
  near: undefined,
  wallet: undefined,
  network: "testnet",
  provider: undefined,
  setNetwork: () => { },
  signIn: () => { },
  signOut: () => { },
})

// connect to NEAR
const ConnectionProvider = (props: any) => {
  const [network, setNetwork] = useState("testnet")
  const [near, setNear] = useState<nearAPI.Near>()
  const [wallet, setWallet] = useState<WalletConnectionProps>()

  const config =
    configs.find((config) => config.networkId === network) || configs[0]

  const provider = useMemo(
    () => new providers.JsonRpcProvider(config.nodeUrl),
    [config.nodeUrl]
  )

  const connectToNear = useCallback(async () => {
    try {
      const near = await connect(config)
      const wallet = new WalletConnection(near, null)
      setNear(near)
      setWallet(wallet)
      console.log({ near, wallet })
    } catch (error) {
      console.log(error)
    }
  }, [config])

  useEffect(() => {
    connectToNear()
  }, [connectToNear])

  const signIn = () => {
    wallet.requestSignIn("marketplace_test_9.xuguangxia.testnet")
  }

  const signOut = () => {
    if (!wallet) return
    wallet.signOut()
  }

  return (
    <ConnectionContext.Provider
      value={{ near, wallet, provider, network, setNetwork, signIn, signOut }}
    >
      {props.children}
    </ConnectionContext.Provider>
  )
}

export default ConnectionProvider
