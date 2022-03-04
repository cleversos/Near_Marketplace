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

export const defaultCollections: TCollection[] = [
  {
    id: "adfasdf",
    imageUrl: "https://i.imgur.com/D2cmOnL.gif",
    name: "basis.markets",
    prevFloorPrice: 11,
    floorPrice: 12,
    volume: 271.9,
    prevVolume: 300,
    prevAvgPrice: 10.5,
    avgPrice: 11.3,
  },
  {
    id: "adfasdf",
    imageUrl:
      "https://dl.airtable.com/.attachmentThumbnails/d087bfe9edf2f6499176ff022fb89df4/d35ec815",
    name: "basis.markets",
    prevFloorPrice: 11,
    floorPrice: 12,
    volume: 271.9,
    prevVolume: 300,
    prevAvgPrice: 10.5,
    avgPrice: 11.3,
  },
]

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

const TopCollectionTable = (props: { timeRange: number }) => {

  const { provider } = useContext(ConnectionContext)
  const { contractAccountId } = useContext(ContractContext)

  const [tableData, setTableData] = useState<any>()

  const [collectionMarketplaceDetails, setCollectionMarketplaceDetails] =
    useState<TCollections | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  const [priceRange, setPriceRange] = useState<PriceRange>({
    currency: "USD",
    min: "min",
    max: "max"
  });

  const getAllCollections = async () => {
    let all = []
    const now = new Date()
    const stepDate = (now.getTime() - props.timeRange * 24 * 60 * 60 * 1000).toString() + "000000"
    const prevDate = (now.getTime() - props.timeRange * 24 * 60 * 60 * 1000 * 2).toString() + "000000"
    const nowString = now.getTime().toString() + "000000"
    const collections = await getCollections(provider, "marketplace_test_10.xuguangxia.testnet")
    console.log(collections, "collections")
    try {
      for (let item of collections) {
        const values = await Promise.all([
          await fetchCollectionMarketDetails(item.collectionId, item.tokenType),
          await fetchItems(item.collectionId),
          await getTradingVolumeForCollection("marketplace_test_10.xuguangxia.testnet", item.collectionId),
          await getTradingVolumeForCollection("marketplace_test_10.xuguangxia.testnet", item.collectionId, prevDate, stepDate),
          await getTradingVolumeForCollection("marketplace_test_10.xuguangxia.testnet", item.collectionId, stepDate, nowString)
        ])
        let newItems = values[1]
        let volumePercent = 0
        console.log(values, "values")
        if (parseFloat(values[4][0].volume) === 0.0) {
          volumePercent = -100.0
        } else if (parseFloat(values[3][0].volume) === 0.0) {
          volumePercent = 100.0
        } else {
          volumePercent = (parseFloat(values[4][0].volume) - parseFloat(values[3][0].volume)) / parseFloat(values[3][0].volume) * 100
        }
        console.log(volumePercent, "volumePercent")
        newItems.sort(function (a, b) {
          return a.price - b.price
        })
        const min = newItems[0].price
        const itemLength = newItems.length
        const sum = newItems.map(item => item?.price).reduce((prev, curr) => prev + curr, 0)
        setIsLoading(false)
        all.push({
          bannerImageUrl: item.bannerImageUrl,
          name: item.name,
          floorPrice: min,
          volume: values[2][0].volume,
          volumePercent: volumePercent,
          count: itemLength,
          avgPrice: (sum / itemLength).toFixed(2)
        })
      }
    } catch (error) {
      console.log(error)
    }
    setTableData(all)
    setIsLoading(false)
  }

  useEffect(() => {
    getAllCollections()
  }, [])

  // fetch collection details using collectionId and tokenType
  const fetchCollectionMarketDetails = useCallback(async (collectionId, tokenType) => {
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
    const collectionDetails: TCollections = {
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
  const fetchItems = useCallback(async (collectionId) => {
    try {
      //get all listed sales in a collection from marketplace contract
      const sales = await getAllSalesInCollection(
        provider,
        contractAccountId,
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
      return items
    } catch (error) {
      console.log(error)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll, priceRange])

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
            <BodyText light>Avg Price</BodyText>
          </th>
          <th>
            <BodyText light>Volume</BodyText>
          </th>
          <th>
            <BodyText light>Volume %</BodyText>
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading &&
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
            </tr>
          </>
        }
        {tableData && tableData?.map((collection, i) => (
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
              <BodyText className="mobile-title">Avg Price</BodyText>
              <BodyText light>{parseFloat(collection.avgPrice).toLocaleString()}</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Volume</BodyText>
              <BodyText light>{parseFloat(collection.volume).toLocaleString()}</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Volume %</BodyText>
              <BodyText light>{parseFloat(collection.volumePercent).toLocaleString()}</BodyText>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TopCollectionTable
