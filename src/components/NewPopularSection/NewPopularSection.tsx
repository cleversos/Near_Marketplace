import { useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CONTRACT_ACCOUNT_ID } from "../../config"
import { ConnectionContext } from "../../contexts/connection"
import { getTradingVolumeForCollection, getCollectionStat } from "../../contexts/transaction"
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

  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<any>()

  const getAllCollections = async () => {
    setIsLoading(true)
    const all = await getCollectionStat();
    setTableData(all)
    setIsLoading(false)
  }

  useEffect(() => {
    getAllCollections()
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
              key < 9 &&
              <NewPopularSectionItem
                key={key}
                data={item}
                number={key + 1}
                image={item.bannerImageUrl}
                name={item.name}
                listItems={tableData.length}
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
