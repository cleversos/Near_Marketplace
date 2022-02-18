import React from "react"
import { Link } from "react-router-dom"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import CollectionCard from "../../../../components/CollectionCard/CollectionCard"
import SectionPadding from "../../../../components/SectionPadding/SectionPadding"
import { defaultPopularCollections } from "../../../../constants/defaultData"
import "./AllCollectionsSection.scss"

const AllCollectionsSection = () => {
  return (
    <div className="home-collections-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">All Collections</BodyText>
          <Link to="/collections">
            <Button title="See All" onClick={() => {}} secondary />
          </Link>
        </div>
        <div className="cards-container">
          {defaultPopularCollections.map((item, i) => (
            <CollectionCard
              id={item.id}
              tokenType={item.tokenType}
              image={item.image}
              name={item.name}
              description={item.description}
            />
          ))}
        </div>
      </SectionPadding>
    </div>
  )
}

export default AllCollectionsSection
