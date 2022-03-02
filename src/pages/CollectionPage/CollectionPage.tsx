import { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ActivityIcon from "../../assets/icons/ActivityIcon"
import ItemsIcon from "../../assets/icons/ItemsIcon"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
import { ConnectionContext } from "../../contexts/connection"
import { ContractContext } from "../../contexts/contract"
import "./CollectionPage.scss"
import CollectionInfoSection from "./components/CollectionInfoSection/CollectionInfoSection"
import FilterSection from "./components/FilterSection/FilterSection"
import GallerySection from "./components/GallerySection/GallerySection"
import { convertTokenResultToItemStruct } from "../../helpers/utils"
import { TItem } from "../ItemPage/ItemPage"
import { getAllSalesInCollection } from "../../helpers/collections"
import { getTransactionsForCollection } from "../../contexts/transaction"
import { formatNearAmount } from "near-api-js/lib/utils/format"

type TCollectionLinks = {
  discord?: string
  twitter?: string
  website?: string
  telegram?: string
  instagram?: string
  medium?: string
}

type PriceRange = {
  currency: string
  min: string
  max: string
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
}

export type TCollectionContractDetails = {
  numberOfItems?: number
  floorPrice?: number
  volTraded?: number
}

const CollectionPage = () => {
  const { collectionId, tokenType } = useParams()

  const { provider, wallet } = useContext(ConnectionContext)
  const { contractAccountId, contract } = useContext(ContractContext)

  const [collectionMarketplaceDetails, setCollectionMarketplaceDetails] =
    useState<TCollection | null>(null)
  const [collectionContractDetails, setCollectionContractDetails] =
    useState<TCollectionContractDetails | null>(null)
  const [items, setItems] = useState<TItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [collapseFilterContainer, setCollapseFilterContainer] = useState(false)
  const [mode, setMode] = useState<"items" | "activities">("items")
  const [priceRange, setPriceRange] = useState<PriceRange>({
    currency: "USD",
    min: "min",
    max: "max"
  });

  // fetch collection details using collectionId and tokenType
  const fetchCollectionMarketDetails = useCallback(async () => {
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
    }
    return collectionDetails
  }, [])

  // fetch items on sale in this collection
  const fetchItems = useCallback(async () => {
    try {
      //get all listed sales in a collection from marketplace contract
      const sales = await getAllSalesInCollection(
        provider,
        contractAccountId,
        collectionId
      )

      // //get the token object for all the sales using nft_tokens_batch
      // const salesTokensResults: any = await provider.query({
      //   request_type: "call_function",
      //   account_id: collectionId,
      //   method_name: "nft_tokens_batch",
      //   args_base64: btoa(
      //     `{"token_ids": ${sales
      //       .filter(({ nft_contract_id }) => nft_contract_id === collectionId)
      //       .map(({ token_id }) => token_id)}}`
      //   ),
      //   finality: "optimistic",
      // })
      // const saleTokens = JSON.parse(
      //   Buffer.from(salesTokensResults.result).toString()
      // )

      const saleTokens = []

      //get token obj for the tokens not gotten by batch fetch (if any)
      for (let i = 0; i < sales.length; i++) {
        const { token_id } = sales[i]
        let token = saleTokens.find(({ token_id: t }) => t === token_id)
        if (!token) {
          const tokenRawResult: any = await provider.query({
            request_type: "call_function",
            account_id: collectionId,
            method_name: "nft_token",
            args_base64: btoa(`{"token_id": "${token_id}"}`),
            finality: "optimistic",
          })
          token = JSON.parse(Buffer.from(tokenRawResult.result).toString())
        }
        sales[i] = Object.assign(sales[i], token)
      }

      const items: TItem[] = sales?.map((result) =>
        convertTokenResultToItemStruct(
          result,
          collectionMarketplaceDetails?.name,
          collectionId
        )
      )
      return items
    } catch (error) {
      console.log(error)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const values = await Promise.all([
        await fetchCollectionMarketDetails(),
        await fetchItems(),
      ])

      setCollectionMarketplaceDetails(values[0])
      console.log(values, "setValues")

      setItems(values[1])

      let newItems = values[1]
      newItems.sort(function (a, b) {
        return a?.price - b?.price
      })
      const min = newItems[0]?.price
      const itemLength = newItems.length
      const sum = newItems.map(item => item?.price).reduce((prev, curr) => prev + curr, 0)
      console.log(values[1])
      setCollectionContractDetails({
        numberOfItems: itemLength,
        floorPrice: min,
        volTraded: sum
      })
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const [activities, setActivities] = useState<any>([])
  const getActivities = async () => {
    const data = await getTransactionsForCollection("marketplace_test_10.xuguangxia.testnet", collectionId)
    const result = []
    for (let item of data) {
      result.push({
        itemName: collectionMarketplaceDetails?.name,
        itemImageUrl: collectionMarketplaceDetails?.profileImageUrl,
        trxId: item.receipt_id,
        time: item.time,
        amount: formatNearAmount(item.args.args_json.price),
        buyer: item.args.args_json.buyer_id,
        seller: item.args.args_json.sale.owner_id,
      })
    }
    setActivities(result)
  }

  useEffect(() => {
    fetchAll()
    getActivities()
  }, [fetchAll, priceRange])

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
      <CollectionInfoSection
        collectionMarketplaceDetails={collectionMarketplaceDetails}
        collectionContractDetails={collectionContractDetails}
        isLoading={isLoading}
      />
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
            priceRange={priceRange}
            setPriceRange={(e) => setPriceRange(e)}
          />
        </div>
        {mode === "items" ? (
          <div className="gallery-section-container">
            <GallerySection
              priceRange={priceRange}
              isLoading={isLoading}
              items={items || null}
              collectionId={collectionId}
              setCollapseFilterContainer={setCollapseFilterContainer}
            />
          </div>
        ) : (
          <ActivityTable
            activities={activities}
          />
        )}
      </div>
    </div>
  )
}

export default CollectionPage
