import { CodeResult } from "near-api-js/lib/providers/provider"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ActivityIcon from "../../assets/icons/ActivityIcon"
import ItemsIcon from "../../assets/icons/ItemsIcon"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
// import { useParams } from 'react-router-dom';
import { NFTItemCardProps } from "../../components/NFTItemCard/NFTItemCard"
import { placeHolderCollection } from "../../constants/defaultData"
import { ConnectionContext } from "../../contexts/connection"
import { ContractContext } from "../../contexts/contract"
import "./CollectionPage.scss"
import CollectionInfoSection from "./components/CollectionInfoSection/CollectionInfoSection"
import FilterSection from "./components/FilterSection/FilterSection"
import GallerySection from "./components/GallerySection/GallerySection"
import * as nearAPI from "near-api-js"

type TCollectionLinks = {
  discord?: string
  twitter?: string
  website?: string
  telegram?: string
  instagram?: string
  medium?: string
}

export type TItem = {
  image: any
  name: string
  collectionTitle: string
  collectionId: string
  price: number
  id: string
}

export type TCollection = {
  collectionId: string
  tokenType: string
  name: string
  isVerified: boolean
  bannerImageUrl: string
  links: TCollectionLinks
  profileImageUrl: string
  creator: string
  royalty: number
  description: string
  numberOfItems?: number
  owners?: number
  floorPrice?: number
  volTraded?: number
}

const CollectionPage = () => {
  const { collectionId, tokenType } = useParams()
  const [collection, setCollection] = useState<TCollection>(null)
  const [items, setItems] = useState<TItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [collapseFilterContainer, setCollapseFilterContainer] = useState(false)
  const [mode, setMode] = useState<"items" | "activities">("items")
  const { provider, wallet } = useContext(ConnectionContext)
  const { contractAccountId, contract } = useContext(ContractContext)

  // fetch collection details using collectionId and tokenType
  const fetchCollectionDetails = useCallback(async () => {
    try {
      // call get_collection fn on the marketplace contract to get the details of the collection
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: contractAccountId,
        method_name: "get_collection",
        args_base64: btoa(
          `{"nft_contract_id": "${collectionId}", "token_type": "${tokenType}"}`
        ),
        finality: "optimistic",
      })
      const result = JSON.parse(Buffer.from(rawResult.result).toString())

      // Use result to create new collection object
      const collectionDetails: TCollection = {
        collectionId: result.nft_contract_id,
        tokenType: result.token_type,
        name: result.name,
        isVerified: result.isVerified,
        bannerImageUrl: result.bannerImageUrl,
        profileImageUrl: result.profileImageUrl,
        description: result.description,
        royalty: result.royalty,
        links: result.links,
        creator: "",
        numberOfItems: 1212,
        owners: 10,
        floorPrice: 2,
        volTraded: 2391,
      }
      console.log({ collectionDetails })
      setCollection(collectionDetails)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [])

  // fetch items on sale in this collection
  const fetchItems = useCallback(async () => {
    console.log({ collectionId, contractAccountId })
    try {
      //get all listed sales in a collection from marketplace contract
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: contractAccountId,
        method_name: "get_sales_by_nft_contract_id",
        args_base64: btoa(
          `{nft_contract_id: '${collectionId}', from_index: 0, limit: 50}}`
        ),
        finality: "optimistic",
      })
      const sales = JSON.parse(Buffer.from(rawResult.result).toString())

      // //get the token object for all the sales
      // const saleTokensResults: any = await provider.query({
      //   request_type: "call_function",
      //   account_id: collectionId,
      //   method_name: "nft_tokens_batch",
      //   args_base64: btoa(
      //     `{token_ids: ${sales
      //       .filter(({ nft_contract_id }) => nft_contract_id === collectionId)
      //       .map(({ token_id }) => token_id)}}`
      //   ),
      //   finality: "optimistic",
      // })
      // const saleTokens = JSON.parse(
      //   Buffer.from(saleTokensResults.result).toString()
      // )

      // for (let i = 0; i < sales.length; i++) {
      //   const { token_id } = sales[i]
      //   let token = saleTokens.find(({ token_id: t }) => t === token_id)
      //   if (!token) {
      //     const tokenRawResult: any = await provider.query({
      //       request_type: "call_function",
      //       account_id: collectionId,
      //       method_name: "nft_token",
      //       args_base64: btoa(`{token_id: ${token_id}}`),
      //       finality: "optimistic",
      //     })
      //     token = JSON.parse(Buffer.from(tokenRawResult.result).toString())
      //   }
      //   sales[i] = Object.assign(sales[i], token)
      // }

      // const items = sales.map((result) => ({
      //   image: result.metadata.media,
      //   name: result.metadata.title,
      //   collectionTitle: collection.name,
      //   collectionId: collection.collectionId,
      //   price: result.sale_condition,
      //   id: result.token_id,
      //   ownerId: result.owner_id,
      // }))
      // setItems(items)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchCollectionDetails()
  }, [fetchCollectionDetails])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const switchToActivities = () => {
    setMode("activities")
    setCollapseFilterContainer(true)
  }

  const switchToItems = () => {
    setMode("items")
    setCollapseFilterContainer(false)
  }

  return (
    <div className="collection-page">
      <CollectionInfoSection collection={collection} isLoading={isLoading} />
      <div className="mode-switch">
        <div
          onClick={switchToItems}
          className={`mode-set ${mode === "items" ? "selected" : ""}`}
        >
          <ItemsIcon isSelected={mode === "items"} />
          <BodyText light>Items</BodyText>
        </div>
        <div
          onClick={switchToActivities}
          className={`mode-set ${mode === "activities" ? "selected" : ""}`}
        >
          <ActivityIcon isSelected={mode === "activities"} />
          <BodyText light>Activities</BodyText>
        </div>
      </div>
      <div className="filter-and-gallery-container">
        <div className="filter-container">
          <FilterSection
            collapseFilterContainer={collapseFilterContainer}
            setCollapseFilterContainer={setCollapseFilterContainer}
          />
        </div>
        {mode === "items" ? (
          <div className="gallery-section-container">
            <GallerySection
              isLoading={isLoading}
              items={items || null}
              collectionId={collectionId}
              setCollapseFilterContainer={setCollapseFilterContainer}
            />
          </div>
        ) : (
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
                mintAddress: "sadfasdfasuf",
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}

export default CollectionPage
