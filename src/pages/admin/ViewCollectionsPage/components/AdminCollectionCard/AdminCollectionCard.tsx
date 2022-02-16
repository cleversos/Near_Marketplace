import React, { useCallback } from "react"
import BodyText from "../../../../../components/BodyText/BodyText"
import { IconLoader } from "../../../../../components/IconLoader"
import ImageWithLoadBg from "../../../../../components/ImageWithLoadBg/ImageWithLoadBg"
import "./AdminCollectionCard.scss"

export interface AdminCollectionCardProps {
  image: any
  name: string
  id: string
  onDeleteClick?: Function
  onEditClick?: Function
}

const AdminCollectionCard = (props: AdminCollectionCardProps) => {
  const { image, name, id, onDeleteClick, onEditClick } = props
  return (
    <div className="admin-collection-card">
      <ImageWithLoadBg aspectRatio={1.386} src={image} alt={name} />
      <div className="details-container">
        <BodyText className="collection-name" bold>
          {name}
        </BodyText>
        <div className="options-container">
          <div className="edit-btn" onClick={() => onEditClick()}>
            <IconLoader icon="edit" />
          </div>
          <div className="delete-btn" onClick={() => onDeleteClick()}>
            <IconLoader icon="delete" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCollectionCard
