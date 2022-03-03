import { formatNearAmount } from "near-api-js/lib/utils/format"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
import Button from "../../components/Button/Button"
import NFTItemCard from "../../components/NFTItemCard/NFTItemCard"
import { CollectionContext } from "../../contexts/collections"
import { ContractContext } from "../../contexts/contract"
import { getUserSalesInMarketplace } from "../../helpers/collections"
import { convertTokenResultToItemStructItem } from "../../helpers/utils"
import { TCollection } from "../CollectionPage/CollectionPage"
import { TItem } from "../ItemPage/ItemPage"
import CollectionAndAllItemsSet from "./components/CollectionAndAllItemsSet/CollectionAndAllItemsSet"
import CollectionAndItemsSet from "./components/CollectionAndItemsSet/CollectionAndItemsSet"
import "./ProfilePage.scss"
import { getTransactionsForUser } from "../../contexts/transaction"
import { useParams } from "react-router-dom"
import { ConnectConfig, keyStores, providers } from "near-api-js"

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
type TProfile = {
  imageUrl: string
  description: string
  items: TItem[]
}
type TProfileMode =
  | "myItems"
  | "listedItems"
  | "offersMade"
  | "offersRecieved"
  | "activities"
export type TProfileCollection = {
  id: string
  imageUrl: string
  name: string
  floorPrice: number
  items: TItem[]
}

const ProfilePage = () => {
  const { userAccount } = useParams()
  const profileUserAccount = userAccount.split("@")[1]

  const config =
    configs.find((config) => config.networkId === "testnet") || configs[0]
  const provider = useMemo(
    () => new providers.JsonRpcProvider(config.nodeUrl),
    [config.nodeUrl]
  )

  const [profile, setProfile] = useState<TProfile | null>(null)
  const [mode, setMode] = useState<TProfileMode>("myItems")
  const { collections } = useContext(CollectionContext)
  const [walletNFTs, setWalletNFTs] = useState<TProfileCollection[]>([])
  const { contractAccountId, contract } = useContext(ContractContext)
  const [listedNfts, setListedNfts] = useState<any>()
  const [activities, setActivities] = useState<any>()

  const getUserTokensInACollection = useCallback(
    async (collection: TCollection, provider, accountId) => {
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: collection.collectionId,
        method_name: "nft_tokens_for_owner",
        args_base64: btoa(
          `{"account_id": "${profileUserAccount}", "from_index": "0", "limit": 100}`
        ),
        finality: "optimistic",
      })
      const items = JSON.parse(Buffer.from(rawResult.result).toString())
      if (!items || !items.length) return null
      return {
        id: collection.collectionId,
        imageUrl: collection.profileImageUrl,
        name: collection.name,
        floorPrice: 10,
        items: items.map((item) =>
          convertTokenResultToItemStructItem(
            item,
            collection.name,
            collection.collectionId
          )
        ),
      }
    },
    []
  )
  const getActivities = async () => {
    const data = await getTransactionsForUser("marketplace_test_10.xuguangxia.testnet", profileUserAccount)
    const result = []
    for (let item of data) {
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: item.args.args_json.sale.nft_contract_id,
        method_name: "nft_token",
        args_base64: btoa(`{"token_id": "${item.args.args_json.sale.token_id}"}`),
        finality: "optimistic",
      })
      const newRow = JSON.parse(Buffer.from(rawResult.result).toString())
      result.push({
        itemName: newRow.metadata.title,
        itemImageUrl: newRow.metadata.media,
        trxId: item.originated_from_transaction_hash,
        time: item.time,
        amount: formatNearAmount(item.args.args_json.price),
        buyer: item.args.args_json.buyer_id,
        seller: item.args.args_json.sale.owner_id,
      })
    }
    setActivities(result)
  }

  const getUserSales = async () => {
    try {
      const sales = await getUserSalesInMarketplace(
        provider,
        contractAccountId,
        profileUserAccount
      )
      setListedNfts(sales)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserSales()

    getActivities()
  }, [])

  const getWalletNFTs = useCallback(async () => {
    try {
      const promises = collections.map(
        async (collection) =>
          await getUserTokensInACollection(
            collection,
            provider,
            profileUserAccount
          )
      )

      const sales = await getUserSalesInMarketplace(
        provider,
        contractAccountId,
        profileUserAccount
      )
      setListedNfts(sales)

      await Promise.all(promises).then((results) =>
        setWalletNFTs(results.filter((result) => result))
      )
    } catch (error) {
      console.log
    }
  }, [])

  useEffect(() => {
    getWalletNFTs()
  }, [getWalletNFTs])

  const totalFloorValue = 235.3
  let listedItemsCollections: TProfileCollection[] = [
    {
      id: "fdfa",
      imageUrl:
        "https://www.arweave.net/OHFIbHqpFpgERaUhApaCFCwclAP_KrBoD0MixurXTDk?ext=png",
      name: "Stressed coders",
      floorPrice: 128,
      items: [],
    },
  ]
  let offersMade = listedItemsCollections //fetch this

  const fetchUserData = useCallback(() => {
    const defaultProfile: TProfile = {
      imageUrl:
        "https://cdn.magiceden.io/rs:fill:400:400:0:0/plain/https://iah4a6tcxv5lewkfzajxddmm7xgktorcgj3wa34476nawekxi44a.arweave.net/QA_AemK9erJZRcgTcY2M_cypuiIyd2BvnP-aCxFXRzg/958.png",
      description:
        "As you can see from my collection, I'm poor. Send help to my wallet address and be blessed. Thanks.",
      items: [],
    }
    setProfile(defaultProfile)
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  return (
    <div className="profile-page">
      <div className="profile-details-container">
        <div className="image-container">
          <img
            src={require("../../assets/images/profile.png")}
            alt="default profile image"
          />
        </div>
        <BodyText className="address" light>
          {profileUserAccount?.slice(0, 6)}...
          {profileUserAccount?.slice(profileUserAccount.length - 4, profileUserAccount.length)}
        </BodyText>
      </div>
      <div className="items-container">
        <div className="options-container">
          <Button
            secondary={mode !== "myItems"}
            title="My items"
            disabled={false}
            onClick={() => setMode("myItems")}
          />
          <Button
            secondary={mode !== "listedItems"}
            title="Listed items"
            disabled={false}
            onClick={() => setMode("listedItems")}
          />
          <Button
            secondary={mode !== "offersMade"}
            title="Offers made"
            disabled={false}
            onClick={() => setMode("offersMade")}
          />
          <Button
            secondary={mode !== "offersRecieved"}
            title="Offers received"
            disabled={false}
            onClick={() => setMode("offersRecieved")}
          />
          <Button
            secondary={mode !== "activities"}
            title="Activities"
            disabled={false}
            onClick={() => setMode("activities")}
          />
        </div>
        {mode === "myItems" &&
          <>
            {
              walletNFTs.length !== 0 ?
                walletNFTs?.map((collection, i) => (
                  <CollectionAndAllItemsSet collection={collection} listedNfts={listedNfts} key={i} />
                ))
                :
                <div className="collection-and-items-set">
                  <div className="nfts-container">
                    {listedNfts && listedNfts?.map((item, i) => (
                      <NFTItemCard
                        key={i}
                        id={item.token_id}
                        collectionId={item.nft_contract_id}
                        image={item.metadata.media}
                        name={item.metadata.title}
                        collectionTitle={item.metadata.title}
                        price={parseFloat(formatNearAmount(item.sale_conditions.near))}
                      />
                    ))}
                  </div>
                </div>
            }
          </>
        }
        {mode === "listedItems" &&
          <div className="collection-and-items-set">
            <div className="nfts-container">
              {listedNfts.map((item, i) => (
                <NFTItemCard
                  key={i}
                  id={item.token_id}
                  collectionId={item.nft_contract_id}
                  image={item.metadata.media}
                  name={item.metadata.title}
                  collectionTitle={item.metadata.title}
                  price={parseFloat(formatNearAmount(item.sale_conditions.near))}
                />
              ))}
            </div>
          </div>
        }
        {mode === "offersMade" &&
          offersMade.map((collection, i) => (
            <CollectionAndItemsSet collection={collection} key={i} />
          ))}
        {mode === "offersRecieved" &&
          <div className="collection-and-items-set">
            <div className="nfts-container">
              {listedNfts.map((item, i) => (
                item.bids.near &&
                <NFTItemCard
                  key={i}
                  id={item.token_id}
                  collectionId={item.nft_contract_id}
                  image={item.metadata.media}
                  name={item.metadata.title}
                  collectionTitle={item.metadata.title}
                  price={parseFloat(formatNearAmount(item.sale_conditions.near))}
                />
              ))}
            </div>
          </div>
        }
        {mode === "activities" && (
          <ActivityTable
            activities={activities}
          />
        )}
      </div>
    </div>
  )
}

export default ProfilePage
