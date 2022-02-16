import { CodeResult } from "near-api-js/lib/providers/provider"
import React, { useCallback, useContext, useEffect, useState } from "react"
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
  collection: string
  collectionId?: string
  price: number
  id: string
}

export type TCollection = {
  collectionId: string
  name: string
  isVerified: boolean
  bannerImageUrl: string
  links: TCollectionLinks
  profileImageUrl: string
  creator: string
  royalty: number
  description: string
  numberOfItems: number
  owners: number
  floorPrice: number
  volTraded: number
}

const CollectionPage = () => {
  // const {collectionId} = useParams();
  const [collection, setCollection] = useState<TCollection>(null)
  const [items, setItems] = useState<TItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [collapseFilterContainer, setCollapseFilterContainer] = useState(false)
  const [mode, setMode] = useState<"items" | "activities">("items")
  const { provider } = useContext(ConnectionContext)
  const { contractAccountId } = useContext(ContractContext)

  // fetch collection details using collectionId
  const fetchCollectionDetails = useCallback(async () => {
    try {
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: contractAccountId,
        method_name: "get_collection",
        args_base64: btoa(
          `{nft_contract_id: ${contractAccountId}, token_type: "token_type"}`
        ),
        finality: "optimistic",
      })
      const result = JSON.parse(Buffer.from(rawResult.result).toString())
      const {
        nft_contract_id,
        token_type,
        name,
        isVerified,
        bannerImageUrl,
        profileImageUrl,
        description,
        royalty,
        links,
      } = result
      const collection: TCollection = {
        collectionId: nft_contract_id + token_type,
        name,
        isVerified,
        bannerImageUrl,
        profileImageUrl,
        description,
        royalty,
        links,
        creator: "",
        numberOfItems: 1212,
        owners: 10,
        floorPrice: 2,
        volTraded: 2391,
      }
      setCollection(collection)
      setIsLoading(false)
    } catch (error) {}
  }, [])

  const fetchItems = useCallback(async () => {}, [])

  useEffect(() => {
    fetchCollectionDetails()
  }, [fetchCollectionDetails])

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
