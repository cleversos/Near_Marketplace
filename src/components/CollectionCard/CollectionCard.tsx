import React from "react"
import { Link } from "react-router-dom"
import BodyText from "../BodyText/BodyText"
import ImageWithLoadBg from "../ImageWithLoadBg/ImageWithLoadBg"
import "./CollectionCard.scss"

export interface CollectionCardProps {
  image: any
  name: string
  volTraded?: number
  description?: string
  id: string
  tokenType: string
}

const CollectionCard = (props: CollectionCardProps) => {
  const { image, name, id, volTraded, description, tokenType } = props
  return (
    <Link to={`/collection/${id}/${tokenType}`} className="collection-card">
      <ImageWithLoadBg aspectRatio={1.386} src={image} alt={name} />
      <div className="details-container">
        <BodyText className="collection-name" bold>
          {name}
        </BodyText>
        {volTraded && (
          <BodyText className="volume" light>
            <span>Ⓝ {volTraded}</span> Total Volume
          </BodyText>
        )}
        <div className="description-container">
          <BodyText className="description" light>
            {description}
          </BodyText>
        </div>
      </div>
    </Link>
  )
}

export default CollectionCard
