import React, { useCallback, useContext, useEffect, useState } from "react"
import BodyText from "../../components/BodyText/BodyText"
import CollectionCard from "../../components/CollectionCard/CollectionCard"
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle"
import { defaultPopularCollections } from "../../constants/defaultData"
import { ConnectionContext } from "../../contexts/connection"
import { ContractContext } from "../../contexts/contract"
import { getCollections } from "../../helpers/collections"
import { TCollection } from "../CollectionPage/CollectionPage"
import "./AllCollectionsPage.scss"

const AllCollectionsPage = () => {
  const [collections, setCollections] = useState<TCollection[]>([])
  const { contractAccountId } = useContext(ContractContext)
  const { provider } = useContext(ConnectionContext)
  const [isFetchingCollections, setIsFetchingCollections] = useState(true)

  const fetchCollections = useCallback(async () => {
    try {
      setIsFetchingCollections(true)
      const results = await getCollections(provider, contractAccountId)
      console.log({ results })
      setCollections(results)
      setIsFetchingCollections(false)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

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
              volTraded={collection.volTraded}
              description={collection.description}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllCollectionsPage
