import React, { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BodyText from "../../../components/BodyText/BodyText"
import Button from "../../../components/Button/Button"
import ImageWithLoadBg from "../../../components/ImageWithLoadBg/ImageWithLoadBg"
import LoadingCircle from "../../../components/LoadingCircle/LoadingCircle"
import ModalContainer from "../../../components/ModalContainer/ModalContainer"
import { CollectionContext } from "../../../contexts/collections"
import { ConnectionContext } from "../../../contexts/connection"
import { ContractContext } from "../../../contexts/contract"
import { getCollections } from "../../../helpers/collections"
import { TCollection } from "../../CollectionPage/CollectionPage"
import AdminCollectionCard from "./components/AdminCollectionCard/AdminCollectionCard"
import "./ViewCollectionAdminPage.scss"

const ViewCollectionAdminPage = () => {
  const { contract } = useContext(ContractContext)
  const [collectionToDelete, setCollectionTodelete] =
    useState<TCollection>(null)
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteBtnFeedback, setDeleteBtnFeedback] = useState("")
  const { collections, isFetchingCollections, fetchCollections } =
    useContext(CollectionContext)

  const deleteCollection = async () => {
    try {
      setDeleteBtnFeedback("Deleting")
      setIsDeleting(true)
      await contract.delete_collection({
        nft_contract_id: collectionToDelete.collectionId,
        token_type: collectionToDelete.tokenType,
      })
      setDeleteBtnFeedback("Deleted")
    } catch (error) {
      setDeleteBtnFeedback("Failed")
      console.log(error)
    }
    setIsDeleting(false)
    setTimeout(async () => {
      setDeleteBtnFeedback("")
      setCollectionTodelete(null)
      await fetchCollections()
    }, 2000)
  }

  const onEdit = (collection) => {
    navigate("/add-collection", {
      state: {
        mode: "edit",
        collectionId: collection.collectionId,
        collectionTokenType: collection.tokenType,
      },
    })
  }

  return (
    <div className="view-collection-admin-page">
      <ModalContainer
        isVisible={Boolean(collectionToDelete)}
        className="view-collection-page-modal"
        onClose={() => setCollectionTodelete(null)}
      >
        <div className="delete-confirm-modal">
          <ImageWithLoadBg
            aspectRatio={1}
            alt={collectionToDelete?.name}
            src={collectionToDelete?.profileImageUrl}
          />
          <BodyText bold className="collection-name">
            {collectionToDelete?.name}
          </BodyText>
          <BodyText>Are you sure you want to delete?</BodyText>
          <div className="btns-container">
            <Button
              className="delete-btn"
              isLoading={isDeleting}
              disabled={false}
              title={deleteBtnFeedback || "Delete"}
              onClick={deleteCollection}
            />
            <Button
              secondary
              disabled={false}
              title="Cancel"
              onClick={() => setCollectionTodelete(null)}
            />
          </div>
        </div>
      </ModalContainer>
      <div className="head">
        <BodyText bold className="page-title">
          Admin View Collections Page
        </BodyText>
        <BodyText light>
          The top NFTs on Galacticway, ranked by volume, floor price and other
          statistics.
        </BodyText>
      </div>
      {isFetchingCollections ? (
        <div className="loading-circle-container">
          <LoadingCircle />
        </div>
      ) : (
        <div className="collections-container">
          {collections.map((collection, i) => (
            <AdminCollectionCard
              image={collection.profileImageUrl}
              name={collection.name}
              id={collection.collectionId}
              tokenType={collection.tokenType}
              key={i}
              onEditClick={() => onEdit(collection)}
              onDeleteClick={() => setCollectionTodelete(collection)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewCollectionAdminPage
