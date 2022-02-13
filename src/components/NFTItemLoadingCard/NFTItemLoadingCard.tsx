import React from 'react';
import ImageWithLoadBg from '../ImageWithLoadBg/ImageWithLoadBg';
import './NFTItemLoadingCard.scss';

const NFTItemLoadingCard = () => {
  return(
    <div className="nft-item-loading-card">
      <ImageWithLoadBg aspectRatio={1.386} src='' alt='' />
      <div className="details-container">
        <div className="collection-and-price-container">
          <div className="collection-name" />
          <div className="price-container" />
        </div>
        <div className="item-name" />
      </div>
    </div>     
  )
}

export default NFTItemLoadingCard;