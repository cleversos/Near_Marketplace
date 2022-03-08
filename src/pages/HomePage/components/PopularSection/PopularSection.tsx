import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import CollectionCard from "../../../../components/CollectionCard/CollectionCard"
import SectionPadding from "../../../../components/SectionPadding/SectionPadding"
import { CollectionContext } from "../../../../contexts/collections"
import { TCollection } from "../../../CollectionPage/CollectionPage"
import { getTradingVolumeForCollection } from "../../../../contexts/transaction"
import { CONTRACT_ACCOUNT_ID } from "../../../../config"

import "./PopularSection.scss"

const PopularSection = () => {
  const { collections } = useContext(CollectionContext)
  const [popularCollections, setPopularCollections] = useState<TCollection[]>([])
  const prepareColleciton = async () => {
    let collectionArray = [];
    let tradingVolumes = new Map()
    for(let i=0; i<collections.length; i++){
      collectionArray.push(collections[i]);
      tradingVolumes.set(collections[i].collectionId, (await getTradingVolumeForCollection(CONTRACT_ACCOUNT_ID,collections[i].collectionId)).volume);
    }
    console.log(tradingVolumes)
    collectionArray.sort((a, b) => {
      return (tradingVolumes[b.collectionId] - tradingVolumes[a.collectionId])
    })
    setPopularCollections(collectionArray.slice(0,4))
  }
  useEffect(()=>{
    prepareColleciton();
  }, [collections])

  return (
    <div className="popular-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">Popular</BodyText>
          <Link to="/collections">
            <Button title="See All" onClick={() => { }} secondary disabled={false} />
          </Link>
        </div>
        <div className="cards-container">
          {collections.slice(0, 4).map((item, i) => (
            <CollectionCard
              key={i}
              id={item.collectionId}
              tokenType={item.tokenType}
              image={item.bannerImageUrl}
              name={item.name}
            />
          ))}
        </div>
      </SectionPadding>
    </div>
  )
}

export default PopularSection
