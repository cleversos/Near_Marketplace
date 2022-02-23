import React, { useContext } from "react"
import BodyText from "../../components/BodyText/BodyText"
import CollectionCard from "../../components/CollectionCard/CollectionCard"
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle"
import { CollectionContext } from "../../contexts/collections"
import "./AllCollectionsPage.scss"

const AllCollectionsPage = () => {
  const { isFetchingCollections, collections } = useContext(CollectionContext)

  return (
    <div className="all-collections-page">
      <BodyText bold className="page-title">
        All Collections
      </BodyText>
      {isFetchingCollections ? (
        <div className="loading-circle-container">
          <LoadingCircle />
        </div>
      ) : (
        <div className="collections-container">
          {collections.map((collection, i) => (
            <CollectionCard
              key={i}
              image={collection.profileImageUrl}
              name={collection.name}
              tokenType={collection.tokenType}
              id={collection.collectionId}
              volTraded={100} //TODO
              description={collection.description}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllCollectionsPage
