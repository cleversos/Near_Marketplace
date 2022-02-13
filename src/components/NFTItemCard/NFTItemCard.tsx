import React from 'react';
import { Link } from 'react-router-dom';
import HeartIcon from '../../assets/icons/HeartIcon';
import BodyText from '../BodyText/BodyText';
import ImageWithLoadBg from '../ImageWithLoadBg/ImageWithLoadBg';
import './NFTItemCard.scss';

export interface NFTItemCardProps {
  image: any;
  name: string;
  collection: string;
  price: number;
  id: string;
}

const NFTItemCard = (props: NFTItemCardProps) => {
  const {image, name, collection, price} = props;
  return(
    <Link to={`/item/${props.id}`} className="nft-item-card">
      <ImageWithLoadBg aspectRatio={1.386} src={image} alt={name} />
      <div className="like-btn">
        <HeartIcon />
      </div>
      <div className="details-container">
        <div className="collection-and-price-container">
          <BodyText className="collection-name" light>{collection}</BodyText>
          <div className="price-container">
            <BodyText className="price" bold>{price} Ⓝ</BodyText>
          </div>
        </div>
        <BodyText className="item-name" bold>{name}</BodyText>
      </div>
    </Link>     
  )
}

export default NFTItemCard;