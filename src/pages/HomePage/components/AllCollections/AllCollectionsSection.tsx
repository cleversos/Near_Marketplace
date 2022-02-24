import { useContext } from "react"
import { Link } from "react-router-dom"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import CollectionCard from "../../../../components/CollectionCard/CollectionCard"
import SectionPadding from "../../../../components/SectionPadding/SectionPadding"
import { CollectionContext } from "../../../../contexts/collections"
import "./AllCollectionsSection.scss"

const AllCollectionsSection = () => {
  const { collections } = useContext(CollectionContext)
  return (
    <div className="home-collections-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">All Collections</BodyText>
          <Link to="/collections">
            <Button title="See All" onClick={() => { }} secondary />
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

export default AllCollectionsSection
