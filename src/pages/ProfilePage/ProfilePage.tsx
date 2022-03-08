import { formatNearAmount } from "near-api-js/lib/utils/format"
import { useCallback, useEffect, useMemo, useState } from "react"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
import Button from "../../components/Button/Button"
import NFTItemCard from "../../components/NFTItemCard/NFTItemCard"
import { getCollections, getUserSalesInMarketplace } from "../../helpers/collections"
import { convertTokenResultToItemStructItem, convertTokenResultToItemStructItemProfile } from "../../helpers/utils"
import { TCollection } from "../CollectionPage/CollectionPage"
import { TItem } from "../ItemPage/ItemPage"
import CollectionAndAllItemsSet from "./components/CollectionAndAllItemsSet/CollectionAndAllItemsSet"
import CollectionAndItemsSet from "./components/CollectionAndItemsSet/CollectionAndItemsSet"
import "./ProfilePage.scss"
import { getTransactionsForUser } from "../../contexts/transaction"
import { useParams } from "react-router-dom"
import { ConnectConfig, keyStores, providers } from "near-api-js"
import { CONTRACT_ACCOUNT_ID } from "../../config"

export const configs: ConnectConfig[] = [
  {
    networkId: "mainnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    // explorerUrl: "https://explorer.mainnet.near.org",
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
    configs.find((config) => config.networkId === "mainnet") || configs[0]

  const provider = useMemo(
    () => new providers.JsonRpcProvider(config.nodeUrl),
    [config.nodeUrl]
  )

  const [mode, setMode] = useState<TProfileMode>("myItems")
  const [walletNFTs, setWalletNFTs] = useState<TProfileCollection[]>([])
  const [listedNfts, setListedNfts] = useState<any[]>()
  const [activities, setActivities] = useState<any>()
  const [collections, setCollections] = useState<any>()
  const [tokenTypeList, setTokenTypeList] = useState<any>()

  const getUserTokensInACollection = useCallback(
    async (collection: TCollection, provider, accountId) => {
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: collection.collectionId,
        method_name: "nft_tokens_for_owner",
        args_base64: btoa(
          `{"account_id": "${profileUserAccount}", "from_index": "0", "limit": 200}`
        ),
        finality: "optimistic",
      })
      const items = JSON.parse(Buffer.from(rawResult.result).toString())
      if (!items || !items.length) return null
      let newItems: any = []
      for (let item of items) {
        const rawContractResult: any = await provider.query({
          request_type: "call_function",
          account_id: collection.collectionId,
          method_name: "nft_metadata",
          args_base64: btoa(`{}`),
          finality: "optimistic",
        })
        const contractMetadata = JSON.parse(Buffer.from(rawContractResult.result).toString())
        item.baseUri = contractMetadata.base_uri
        newItems.push(item)
      }
      return {
        id: collection.collectionId,
        imageUrl: collection.profileImageUrl,
        name: collection.name,
        items: newItems.map((item) =>
          convertTokenResultToItemStructItemProfile(
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
    const data = await getTransactionsForUser(CONTRACT_ACCOUNT_ID, profileUserAccount)
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

  useEffect(() => {
    getActivities()
  }, [])

  const [offerMadeList, setOfferMadeList] = useState<any>([]);

  const getWalletNFTs = useCallback(async () => {

    let madeList: any = []
    try {
      const collections = await getCollections(provider, CONTRACT_ACCOUNT_ID)
      setCollections(collections)
      const tokenTypeList = new Map()
      for (let i = 0; i < collections.length; i++) {
        tokenTypeList.set(collections[i].collectionId, collections[i].tokenType);
      }
      setTokenTypeList(tokenTypeList);
      const sales = await getUserSalesInMarketplace(
        provider,
        CONTRACT_ACCOUNT_ID,
        profileUserAccount
      )
      for (let i = 0; i < sales.length; i++) {
        sales[i].token_type = tokenTypeList.get(sales[i].nft_contract_id);
      }
      console.log(sales, "LOOK")
      setListedNfts(sales)
      const promises = collections.map(
        async (collection) => {
          try {
            return (await getUserTokensInACollection(
              collection,
              provider,
              profileUserAccount
            ));
          } catch (error) {
            return null;
          }
        }
      )
      try {
        for (let contract of collections) {
          const rawResult: any = await provider.query({
            request_type: "call_function",
            account_id: CONTRACT_ACCOUNT_ID,
            method_name: "get_sales_by_nft_contract_id",
            args_base64: btoa(
              `{"nft_contract_id": "${contract.collectionId}", "from_index": "0", "limit": 200}`
            ),
            finality: "optimistic",
          })
          const sales = JSON.parse(Buffer.from(rawResult.result).toString())
          // find offer made state
          for (let item of sales) {
            if (item.bids.near && item.bids.near.length !== 0) {
              for (let offer of item.bids.near) {
                if (offer.owner_id === profileUserAccount) {
                  const nftDetail = await fetchItemTokenDetails(item.nft_contract_id, item.token_id)
                  madeList.push(nftDetail)
                }
              }
            }
          }
        }
        for (let i = 0; i < madeList.length; i++) {
          madeList[i].tokenType = tokenTypeList.get(madeList[i].collectionId);
        }
        setOfferMadeList(madeList)
        console.log(madeList, "MadeList");
      } catch (error) {
        console.log(error, " : getWalletNFTs error")
      }
      await Promise.all(promises).then((results) => {
        const walletNFTs = results.filter((result) => result)
        console.log(walletNFTs, "sdfsfsdfsdf");
        for (let i = 0; i < walletNFTs.length; i++) {
          for (let j = 0; j < walletNFTs[i].items.length; j++) {
            walletNFTs[i].items[j].tokenType = tokenTypeList.get(walletNFTs[i].items[j].collectionId);
          }
        }
        setWalletNFTs(walletNFTs)
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const fetchItemTokenDetails = useCallback(async (collectionId, itemId) => {
    const rawResult: any = await provider.query({
      request_type: "call_function",
      account_id: collectionId,
      method_name: "nft_token",
      args_base64: btoa(`{"token_id": "${itemId}"}`),
      finality: "optimistic",
    })
    const result = JSON.parse(Buffer.from(rawResult.result).toString())
    const collections = await getCollections(provider, CONTRACT_ACCOUNT_ID);
    let collectionName = "";
    for (let i = 0; i < collections.length; i++) {
      if (collections[i].collectionId == collectionId) {
        collectionName = collections[i].name
      }
    }
    const data = convertTokenResultToItemStructItem(
      result,
      collectionName,
      collectionId
    )
    return data
  }, [])

  useEffect(() => {
    getWalletNFTs()
  }, [getWalletNFTs])

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
              collections?.map((collection, i) => {
                let collectionData = {
                  id: collection.collectionId,
                  imageUrl: collection.profileImageUrl,
                  name: collection.name,
                  items: [],
                  floorPrice: 0
                };
                for (const collectionInfo of walletNFTs) {
                  if (collectionInfo.id == collection.collectionId) {
                    collectionData.items = collectionInfo.items
                    break;
                  }
                }
                return (
                  <CollectionAndAllItemsSet collection={collectionData} listedNfts={listedNfts} key={i} />
                )
              })
            }
          </>
        }
        {mode === "listedItems" &&
          <div className="collection-and-items-set">
            <div className="nfts-container">
              {listedNfts?.map((item, i) => (
                <NFTItemCard
                  key={i}
                  tokenType={item.token_type}
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
          <div className="collection-and-items-set">
            <div className="nfts-container">
              {offerMadeList?.map((item, i) => (
                <NFTItemCard
                  key={i}
                  id={item.id}
                  collectionId={item.collectionId}
                  image={item.image}
                  tokenType={item.tokenType}
                  name={item.name}
                  collectionTitle={item.collectionTitle}
                  price={parseFloat(formatNearAmount(item.price))}
                />
              ))}
            </div>
          </div>
        }
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
                  tokenType={item.token_type}
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
