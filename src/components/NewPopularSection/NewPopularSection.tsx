import { useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CONTRACT_ACCOUNT_ID } from "../../config"
import { ConnectionContext } from "../../contexts/connection"
import { getTradingVolumeForCollection } from "../../contexts/transaction"
import { getAllSalesInCollection, getCollections } from "../../helpers/collections"
import { convertTokenResultToItemStruct } from "../../helpers/utils"
import { TItem } from "../../pages/ItemPage/ItemPage"
import BodyText from "../BodyText/BodyText"
import Button from "../Button/Button"
import NewPopularSectionItem from "../NewPopularSectionItem/NewPopularSectionItem"
import SectionPadding from "../SectionPadding/SectionPadding"
import "./NewPopularSection.scss"

type TCollection = {
  id: string
  imageUrl: string
  name: string
  floorPrice: number
  prevFloorPrice: number
  prevVolume: number
  volume: number
  prevAvgPrice: number
  avgPrice: number
}

type TCollectionLinks = {
  discord?: string
  twitter?: string
  website?: string
  telegram?: string
  instagram?: string
  medium?: string
}

export type TCollections = {
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
  owners?: number
  floorPrice?: number
  volTraded?: number
}

interface TableData {
  bannerImageUrl: string
  name: string
  floorPrice: number
  count: number
  avgPrice: number
}
const NewPopularSection = () => {

  const { provider } = useContext(ConnectionContext)
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<any>()

  const [collectionMarketplaceDetails, setCollectionMarketplaceDetails] =
    useState<TCollections | null>(null)

  const getAllCollections = async () => {
    setIsLoading(true)
    let all = []
    const now = new Date()
    const oneDayDate = (now.getTime() - 1 * 24 * 60 * 60 * 1000).toString() + "000000"
    const twoDaysDate = (now.getTime() - 2 * 24 * 60 * 60 * 1000).toString() + "000000"
    const oneWeekDate = (now.getTime() - 7 * 24 * 60 * 60 * 1000).toString() + "000000"
    const twoWeeksDate = (now.getTime() - 14 * 24 * 60 * 60 * 1000).toString() + "000000"
    const nowString = now.getTime().toString() + "000000"
    const collections = await getCollections(provider, CONTRACT_ACCOUNT_ID)
    console.log(oneDayDate, twoDaysDate, oneWeekDate, twoWeeksDate, "timestamps")
    try {
      for (let item of collections) {
        console.log(item, item.tokenType)
        const values = await Promise.all([
          await fetchCollectionMarketDetails(item.collectionId, item.tokenType),
          await fetchItems(item.collectionId),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, twoDaysDate, oneDayDate),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, oneDayDate, nowString),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, twoWeeksDate, oneWeekDate),
          await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID, item.collectionId, oneWeekDate, nowString),
        ])
        let newItems = values[1]

        let volumeDayPercent = 0
        if (parseFloat(values[3].volume) === 0.0) {
          volumeDayPercent = 100.0
        } else if (parseFloat(values[4].volume) === 0.0) {
          volumeDayPercent = -100.0
        } else {
          volumeDayPercent = (parseFloat(values[4].volume) - parseFloat(values[3].volume)) / parseFloat(values[3].volume) * 100
        }

        let volumeWeekPercent = 0
        if (parseFloat(values[5].volume) === 0.0) {
          volumeWeekPercent = 100.0
        } else if (parseFloat(values[6].volume) === 0.0) {
          volumeWeekPercent = -100.0
        } else {
          volumeWeekPercent = (parseFloat(values[6].volume) - parseFloat(values[5].volume)) / parseFloat(values[5].volume) * 100
        }

        let min = 0
        let itemLength = 0
        let sum = 0
        let avgPrice = "0"

        if (newItems.length !== 0) {
          newItems.sort(function (a, b) {
            return a.price - b.price
          })
          min = newItems[0].price
          itemLength = newItems.length
          sum = newItems.map(item => item?.price).reduce((prev, curr) => prev + curr, 0)
          avgPrice = (sum / itemLength).toFixed(2)
        }

        all.push({
          bannerImageUrl: item.bannerImageUrl,
          name: item.name,
          floorPrice: min,
          volumeTotal: values[2].volume,
          dailyVolume: values[4].volume,
          dailyChange: volumeDayPercent,
          weeklyVolume: values[6].volume,
          weeklyChange: volumeWeekPercent,
          count: itemLength,
          avgPrice: avgPrice
        })

      }
    } catch (error) {
      console.log(error)
    }
    setTableData(all)
    console.log(all, "all table")
    setIsLoading(false)
  }

  useEffect(() => {
    getAllCollections()
  }, [])

  // fetch collection details using collectionId and tokenType
  const fetchCollectionMarketDetails = useCallback(async (collectionId, tokenType) => {
    console.log("fetchCollectionMarketDetails");
    let collectionDetails: TCollections;
    try {

      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: CONTRACT_ACCOUNT_ID,
        method_name: "get_collection",
        args_base64: btoa(
          `{"nft_contract_id": "${collectionId}", "token_type": "${tokenType}"}`
        ),
        finality: "optimistic",
      })
      const result = JSON.parse(Buffer.from(rawResult.result).toString())
      collectionDetails = {
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
    } catch (error) {
      console.log("fetchCollectionMarketDetails error");
      return null
    }
    console.log("fetchCollectionMarketDetails return");
    return collectionDetails
  }, [])
  // fetch items on sale in this collection
  const fetchItems = useCallback(async (collectionId) => {
    console.log("fetchItems in")
    try {
      //get all listed sales in a collection from marketplace contract
      const sales = await getAllSalesInCollection(
        provider,
        CONTRACT_ACCOUNT_ID,
        collectionId
      )

      const saleTokens = []

      //get token obj for the tokens not gotten by batch fetch (if any)
      for (let i = 0; i < sales.length; i++) {
        const { token_id, token_type } = sales[i]
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
          collectionId,
        )
      )
      console.log("fetchItems return")
      return items
    } catch (error) {
      console.log(error)
      return []
    }
  }, [])
  return (
    <section>
      <SectionPadding>
        <div className="head display-between">
          <BodyText className="section-title-text">Top collections over last 7 days</BodyText>
          <Link to="/collections">
            <Button title="See All" onClick={() => { }} secondary disabled={false} />
          </Link>
        </div>
        <div className="popular-content">
          {tableData !== undefined &&
            tableData?.length !== 0 && tableData.map((item, key) => (
              key < 8 &&
              <NewPopularSectionItem
                key={key}
                number={key + 1}
                image={item.bannerImageUrl}
                name={item.name}
                floorPrice={item.floorPrice}
                weeklyChange={item.weeklyChange}
                weeklyVolume={item.weeklyVolume}
              />
            ))}
        </div>
      </SectionPadding>
    </section>
  )
}

export default NewPopularSection
