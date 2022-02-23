import React, { useContext, useEffect } from "react"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import CollectionCard from "../../../../components/CollectionCard/CollectionCard"
import SectionPadding from "../../../../components/SectionPadding/SectionPadding"
import { CollectionContext } from "../../../../contexts/collections"
import "./PopularSection.scss"

const PopularSection = () => {
  const { collections } = useContext(CollectionContext)
  useEffect(() => {
    console.log(collections, "collections");
  }, [])
  return (
    <div className="popular-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">Popular</BodyText>
          <Button title="See All" onClick={() => { }} secondary />
        </div>
        <div className="cards-container">
          {collections.slice(0, 4).map((item, i) => (
            <CollectionCard
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
