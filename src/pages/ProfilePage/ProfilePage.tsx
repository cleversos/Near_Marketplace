import React, { useCallback, useContext, useEffect, useState } from "react"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
import Button from "../../components/Button/Button"
import { CollectionContext } from "../../contexts/collections"
import { ConnectionContext } from "../../contexts/connection"
import { convertTokenResultToItemStruct } from "../../helpers/utils"
import { TCollection } from "../CollectionPage/CollectionPage"
import { TItem } from "../ItemPage/ItemPage"
import CollectionAndItemsSet from "./components/CollectionAndItemsSet/CollectionAndItemsSet"
import "./ProfilePage.scss"

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
  const [profile, setProfile] = useState<TProfile | null>(null)
  const { wallet, provider } = useContext(ConnectionContext)
  const walletAddress = wallet?.getAccountId()
  const [mode, setMode] = useState<TProfileMode>("myItems")
  const { collections } = useContext(CollectionContext)
  const [walletNFTs, setWalletNFTs] = useState<TProfileCollection[]>([])

  const getUserTokensInACollection = useCallback(
    async (collection: TCollection, provider, accountId) => {
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: collection.collectionId,
        method_name: "nft_tokens_for_owner",
        args_base64: btoa(
          `{"account_id": "${accountId}", "from_index": "0", "limit": 100}`
        ),
        finality: "optimistic",
      })
      const items = JSON.parse(Buffer.from(rawResult.result).toString())
      console.log({ items })
      if (!items || !items.length) return null
      return {
        id: collection.collectionId,
        imageUrl: collection.profileImageUrl,
        name: collection.name,
        floorPrice: 10,
        items: items.map((item) =>
          convertTokenResultToItemStruct(
            item,
            collection.name,
            collection.collectionId
          )
        ),
      }
    },
    []
  )

  const getWalletNFTs = useCallback(async () => {
    try {
      const promises = collections.map(
        async (collection) =>
          await getUserTokensInACollection(
            collection,
            provider,
            wallet?.getAccountId()
          )
      )
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
          <img src={profile?.imageUrl} alt={walletAddress || ""} />
        </div>
        <BodyText className="address" light>
          {walletAddress?.slice(0, 6)}...
          {walletAddress?.slice(walletAddress.length - 4, walletAddress.length)}
        </BodyText>
        <BodyText className="description" light>
          {profile?.description}
        </BodyText>
      </div>
      <div className="items-container">
        <div className="total-floor">
          <BodyText light>TOTAL FLOOR VALUE</BodyText>
          <BodyText>{totalFloorValue} Ⓝ</BodyText>
        </div>
        <div className="options-container">
          <Button
            secondary={mode !== "myItems"}
            title="My items"
            onClick={() => setMode("myItems")}
          />
          <Button
            secondary={mode !== "listedItems"}
            title="Listed items"
            onClick={() => setMode("listedItems")}
          />
          <Button
            secondary={mode !== "offersMade"}
            title="Offers made"
            onClick={() => setMode("offersMade")}
          />
          <Button
            secondary={mode !== "offersRecieved"}
            title="Offers received"
            onClick={() => setMode("offersRecieved")}
          />
          <Button
            secondary={mode !== "activities"}
            title="Activities"
            onClick={() => setMode("activities")}
          />
        </div>
        {mode === "myItems" &&
          walletNFTs?.map((collection, i) => (
            <CollectionAndItemsSet collection={collection} />
          ))}
        {mode === "listedItems" &&
          listedItemsCollections.map((collection, i) => (
            <CollectionAndItemsSet collection={collection} />
          ))}
        {mode === "offersMade" &&
          offersMade.map((collection, i) => (
            <CollectionAndItemsSet collection={collection} key={i} />
          ))}
        {mode === "offersRecieved" &&
          offersMade.map((collection, i) => (
            <CollectionAndItemsSet collection={collection} key={i} />
          ))}
        {mode === "activities" && (
          <ActivityTable
            activities={[
              {
                itemName: "Stressed Coders #2352",
                itemImageUrl:
                  "https://cdn.magiceden.io/rs:fill:40:40:0:0/plain/https://arweave.net/L1DNqHMvx9ngzWSAp5DSibVUo6YWDTdLXAjAAzTdvvs/1663.png",
                trxType: "Listing",
                trxId: "sadfasdfasuf",
                time: 1644244154000,
                amount: 15.8,
                buyer: "FZXg6PdjCjoz54TTT5Tvq97Y9hnpWCLsCqPmfCHSSWYx",
                seller: "ssde09£ssdfdfadfasuf",
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

export default ProfilePage
