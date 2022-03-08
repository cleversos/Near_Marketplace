import { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ActivityIcon from "../../assets/icons/ActivityIcon"
import ItemsIcon from "../../assets/icons/ItemsIcon"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
import { ConnectionContext } from "../../contexts/connection"
import { ContractContext } from "../../contexts/contract"
import CollectionInfoSection from "./components/CollectionInfoSection/CollectionInfoSection"
import FilterSection from "./components/FilterSection/FilterSection"
import GallerySection from "./components/GallerySection/GallerySection"
import { convertTokenResultToItemStructCollection } from "../../helpers/utils"
import { TItem } from "../ItemPage/ItemPage"
import { getAllSalesInCollection } from "../../helpers/collections"
import { getCollectionStat, getTransactionsForCollection } from "../../contexts/transaction"
import { formatNearAmount } from "near-api-js/lib/utils/format"
import { CONTRACT_ACCOUNT_ID } from "../../config"
import "./CollectionPage.scss"

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
  updated_at: number
}

export type TCollectionContractDetails = {
  numberOfItems?: number
  floorPrice?: number
  volTraded?: number
}

var _ = require('lodash');

const CollectionPage = () => {
  const { collectionId, tokenType } = useParams()

  const { provider } = useContext(ConnectionContext)
  const { contractAccountId } = useContext(ContractContext)

  const [collectionMarketplaceDetails, setCollectionMarketplaceDetails] =
    useState<TCollection | null>(null)
  const [collectionContractDetails, setCollectionContractDetails] =
    useState<TCollectionContractDetails | null>(null)
  const [items, setItems] = useState<TItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [collapseFilterContainer, setCollapseFilterContainer] = useState(true)
  const [mode, setMode] = useState<"items" | "activities">("items")
  const [priceRange, setPriceRange] = useState<PriceRange>({
    currency: "USD",
    min: "min",
    max: "max"
  });
  const [forceRender, setForceRender] = useState(false)
  const [attdFilterData, setAttdFilterData] = useState()
  const fixFilterData = (e) => {
    setForceRender(!forceRender)
    setAttdFilterData(e)
  }

  useEffect(() => {
    const bodyWidth = document.body.clientWidth
    setCollapseFilterContainer(bodyWidth < 800)
  }, [])

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
      updated_at: result.updated_at,
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

      const saleTokens = []
      const attds = []
      //get token obj for the tokens not gotten by batch fetch (if any)
      for (let item of sales) {
        const { token_id } = item
        let token = saleTokens.find(({ token_id: t }) => t === token_id)
        let contractMetadata;
        if (!token) {
          const tokenRawResult: any = await provider.query({
            request_type: "call_function",
            account_id: collectionId,
            method_name: "nft_token",
            args_base64: btoa(`{"token_id": "${token_id}"}`),
            finality: "optimistic",
          })
          token = JSON.parse(Buffer.from(tokenRawResult.result).toString())
          const rawContractResult: any = await provider.query({
            request_type: "call_function",
            account_id: collectionId,
            method_name: "nft_metadata",
            args_base64: btoa(`{}`),
            finality: "optimistic",
          })
          contractMetadata = JSON.parse(Buffer.from(rawContractResult.result).toString())
        }
        item = Object.assign(item, token)
        if (item.metadata.reference) {
          const fetchUri = `${contractMetadata.base_uri}/${item.metadata.reference}`
          let metadata: any = [];
          try {
            await fetch(fetchUri)
              .then(resp =>
                resp.json()
              ).catch((e) => {
                console.log(e);
              }).then((json) => {
                metadata = json
                item = Object.assign(item, { "attribute": json.attributes })
              })
          } catch (error) {
            console.log(error)
            return null
          }
          attds.push(...metadata.attributes)
        } else {
          item = Object.assign(item, { "attribute": [] })
        }
      }

      let mapFilterData = new Map();
      for (let i = 0; i < attds.length; i++) {
        let content = attds[i];
        let contentData = [];
        if (mapFilterData.has(content.trait_type)) {
          contentData = mapFilterData.get(content.trait_type);
        }
        if (!contentData.includes(content.value)) {
          contentData.push(content.value);
        }
        mapFilterData.set(content.trait_type, contentData);
      }
      if (!sales || !sales.length) return null
      let newItems: any = []
      for (let item of sales) {
        const rawContractResult: any = await provider.query({
          request_type: "call_function",
          account_id: collectionId,
          method_name: "nft_metadata",
          args_base64: btoa(`{}`),
          finality: "optimistic",
        })
        const contractMetadata = JSON.parse(Buffer.from(rawContractResult.result).toString())
        item.baseUri = contractMetadata.base_uri
        newItems.push(item)
      }
      const items: TItem[] = newItems?.map((result) =>
        convertTokenResultToItemStructCollection(
          result,
          collectionMarketplaceDetails?.name,
          collectionId
        )
      )

      let attdArray: any;
      if (mapFilterData !== undefined) {
        attdArray = Array.from(mapFilterData, ([name, value]) => ({ name, value }));
      }
      fixFilterData(attdArray)
      return { items, mapFilterData }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const [attributesFilterOptions, setAttributesFilterOptions] = useState<any>()

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const values = await Promise.all([
        await fetchCollectionMarketDetails(),
        await fetchItems(),
      ])
      setCollectionMarketplaceDetails(values[0])
      if (values[1]) {
        setItems(values[1].items)
        setAttributesFilterOptions(values[1].mapFilterData)

        let newItems = values[1].items
        newItems.sort(function (a, b) {
          return a?.price - b?.price
        })
        const min = newItems[0]?.price
        const itemLength = newItems.length
        let sum = null
        const all = await getCollectionStat();
        for (let collectionStat of all) {
          if (collectionStat.name === values[0].name) {
            sum = collectionStat.volumeTotal
          }
        }
        setCollectionContractDetails({
          numberOfItems: itemLength,
          floorPrice: min,
          volTraded: sum
        })
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      return null
    }
    setIsLoading(false)
  }, [])

  const [activities, setActivities] = useState<any>([])
  const getActivities = async () => {
    const data = await getTransactionsForCollection(CONTRACT_ACCOUNT_ID, collectionId)
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

      const rawContractResult: any = await provider.query({
        request_type: "call_function",
        account_id: collectionId,
        method_name: "nft_metadata",
        args_base64: btoa(`{}`),
        finality: "optimistic",
      })
      const contractMetadata = JSON.parse(Buffer.from(rawContractResult.result).toString())
      result.push({
        itemName: newRow.metadata.title,
        itemImageUrl: `${contractMetadata.base_uri}/${newRow.metadata.media}`,
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
            attributesFilterOptions={attributesFilterOptions}
            attdFilterData={attdFilterData}
            fixFilterData={(e: any) => fixFilterData(e)}
          />
        </div>
        {mode === "items" ? (
          <div className="gallery-section-container">
            <GallerySection
              priceRange={priceRange}
              isLoading={isLoading}
              items={items || null}
              tokenType={tokenType}
              collectionId={collectionId}
              attdFilterData={attdFilterData}
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
