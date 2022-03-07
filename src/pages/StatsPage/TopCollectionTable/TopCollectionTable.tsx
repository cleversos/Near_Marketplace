import { Skeleton } from "@mui/material"
import { useCallback, useContext, useEffect, useState } from "react"
import BodyText from "../../../components/BodyText/BodyText"
import { ConnectionContext } from "../../../contexts/connection"
import { ContractContext } from "../../../contexts/contract"
import { getTradingVolumeForCollection } from "../../../contexts/transaction"
import { getAllSalesInCollection, getCollections } from "../../../helpers/collections"
import { convertTokenResultToItemStruct } from "../../../helpers/utils"
import { TItem } from "../../ItemPage/ItemPage"
import moment from 'moment';
import "./TopCollectionTable.scss"
import { CONTRACT_ACCOUNT_ID } from "../../../config"

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

const TopCollectionTable = (props: {}) => {

  const { provider } = useContext(ConnectionContext)

  const [tableData, setTableData] = useState<any>()

  const [collectionMarketplaceDetails, setCollectionMarketplaceDetails] =
    useState<TCollections | null>(null)

  const [isLoading, setIsLoading] = useState(true)

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
        console.log(values[0], "fetch items")

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
      console.log("fetchItems return")
      return items
    } catch (error) {
      console.log(error)
      return []
    }
  }, [])

  return (
    <table className="top-collection-table">
      <thead>
        <tr>
          <th>
            <BodyText light>#</BodyText>
          </th>
          <th>
            <BodyText light>Collection</BodyText>
          </th>
          <th>
            <BodyText light>NFT Floor Price</BodyText>
          </th>
          <th>
            <BodyText light>Daily Volume</BodyText>
          </th>
          <th>
            <BodyText light>Daily Volume Change</BodyText>
          </th>
          <th>
            <BodyText light>Average Price</BodyText>
          </th>
          {/* <th>
            <BodyText light>Average Price %</BodyText>
          </th> */}
          <th>
            <BodyText light>Weekly Volume</BodyText>
          </th>
          <th>
            <BodyText light>Weekly Volume Change</BodyText>
          </th>
          <th>
            <BodyText light>Total Volume</BodyText>
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading ?
          <>
            <tr>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              {/* <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td> */}
            </tr>
            <tr>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td>
              {/* <td>
                <Skeleton animation="wave" style={{ width: "100%", height: 20, backgroundColor: "#ffffff3b" }} />
              </td> */}
            </tr>
          </>
          :
          tableData && tableData?.map((collection, i) => (
            <tr key={i}>
              <td className="number">
                <BodyText>{i + 1}</BodyText>
              </td>
              <td>
                <div className="collection-name-and-img-column">
                  <img src={collection.bannerImageUrl} alt={collection.name} />
                  <BodyText className="collection-title">
                    {collection.name}
                  </BodyText>
                </div>
              </td>
              <td>
                <BodyText className="mobile-title">NFT Floor Price</BodyText>
                <BodyText light>{collection.floorPrice}</BodyText>
              </td>
              <td>
                <BodyText className="mobile-title">Daily Volume</BodyText>
                <BodyText light>{collection.dailyVolume}</BodyText>
              </td>
              <td>
                <BodyText className="mobile-title">Daily Volume Change</BodyText>
                <BodyText light className={
                  parseFloat(collection.dailyChange) > 0 ? "green" : "red"
                }>{parseFloat(collection.dailyChange).toLocaleString()}%</BodyText>
              </td>
              <td>
                <BodyText className="mobile-title">Average Price</BodyText>
                <BodyText light>{parseFloat(collection.avgPrice).toLocaleString()}</BodyText>
              </td>
              {/* <td>
                <BodyText className="mobile-title">Average Price %</BodyText>
                <BodyText light className={
                  parseFloat(collection.avgPrice) > 0 ? "green" : "red"
                }>{parseFloat(collection.avgPrice).toLocaleString()}</BodyText>
              </td> */}
              <td>
                <BodyText className="mobile-title">Weekly Volume</BodyText>
                <BodyText light>{parseFloat(collection.weeklyVolume).toLocaleString()}</BodyText>
              </td>
              <td>
                <BodyText className="mobile-title">Weekly Volume Change</BodyText>
                <BodyText light className={
                  parseFloat(collection.weeklyChange) > 0 ? "green" : "red"
                }>{parseFloat(collection.weeklyChange).toLocaleString()}%</BodyText>
              </td>
              <td>
                <BodyText className="mobile-title">Total Volume</BodyText>
                <BodyText light>{parseFloat(collection.volumeTotal).toLocaleString()}</BodyText>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

export default TopCollectionTable
