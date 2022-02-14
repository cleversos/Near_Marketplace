import React from "react"
import DiscordIcon from "../../../../assets/icons/DiscordIcon"
import InstagramIcon from "../../../../assets/icons/InstagramIcon"
import MediumIcon from "../../../../assets/icons/MediumIcon"
import TelegramIcon from "../../../../assets/icons/TelegramIcon"
import TwitterIcon from "../../../../assets/icons/TwitterIcon"
import VerifiedIcon from "../../../../assets/icons/VerifiedIcon"
import WebsiteIcon from "../../../../assets/icons/WebsiteIcon"
import BodyText from "../../../../components/BodyText/BodyText"
import { TCollection } from "../../CollectionPage"
import "./CollectionInfoSection.scss"

interface CollectionInfoSectionProps {
  collection: TCollection | null
  isLoading: boolean
}
const CollectionInfoSection = (props: CollectionInfoSectionProps) => {
  const { collection, isLoading } = props
  return (
    <div className="collection-info-section">
      <div className="banner-section">
        <div className="collection-links">
          {collection?.links.website && (
            <a
              href={collection?.links.website}
              rel="noreferrer"
              target="_blank"
            >
              <WebsiteIcon />
            </a>
          )}
          {collection?.links.discord && (
            <a
              href={collection?.links.discord}
              rel="noreferrer"
              target="_blank"
            >
              <DiscordIcon />
            </a>
          )}
          {collection?.links.telegram && (
            <a
              href={collection?.links.telegram}
              rel="noreferrer"
              target="_blank"
            >
              <TelegramIcon />
            </a>
          )}
          {collection?.links.medium && (
            <a href={collection?.links.medium} rel="noreferrer" target="_blank">
              <MediumIcon />
            </a>
          )}
          {collection?.links.instagram && (
            <a
              href={collection?.links.instagram}
              rel="noreferrer"
              target="_blank"
            >
              <InstagramIcon />
            </a>
          )}
          {collection?.links.twitter && (
            <a
              href={collection?.links.twitter}
              rel="noreferrer"
              target="_blank"
            >
              <TwitterIcon />
            </a>
          )}
        </div>
        <div className="image-container">
          <div className="darkener" />
          <img
            src={require("../../../../assets/images/placeHolderBanner.png")} //replace with colletion.bannerImageUrl
            alt="collection"
          />
        </div>
      </div>
      <div className="details-container">
        <div className="collection-image-container">
          <img
            src={require("../../../../assets/images/collectionImage.png")} //replace with collection.profleImageUrl
            alt={collection?.name}
          />
        </div>
        <div className="name-container">
          <BodyText bold>{collection?.name}</BodyText>
          {collection?.isVerified && (
            <div className="verified-icon">
              <VerifiedIcon />
            </div>
          )}
        </div>
        <BodyText className="creator-text">
          Created by
          <span className="green">{` ${collection?.creator}`}</span>
        </BodyText>
        <BodyText light className="description">
          {collection?.description}
        </BodyText>
      </div>
      <div className="collection-stats-container">
        <div className="stat-set">
          <BodyText bold>{collection?.numberOfItems}</BodyText>
          <BodyText light>Items</BodyText>
        </div>
        <div className="stat-set">
          <BodyText bold>{collection?.owners}</BodyText>
          <BodyText light>Owners</BodyText>
        </div>
        <div className="stat-set">
          <BodyText bold>
            {collection?.floorPrice}
            <span style={{ marginLeft: "5px" }}>Ⓝ</span>
          </BodyText>
          <BodyText light>Floor price</BodyText>
        </div>
        <div className="stat-set">
          <BodyText bold>
            {collection?.volTraded}
            <span style={{ marginLeft: "5px" }}>Ⓝ</span>
          </BodyText>
          <BodyText light>Volume traded</BodyText>
        </div>
      </div>
    </div>
  )
}

export default CollectionInfoSection
