import React, { useState } from 'react';
import FilterIcon from '../../../../assets/icons/FilterIcon';
import GalleryIcon1 from '../../../../assets/icons/GalleryIcon1';
import GalleryIcon2 from '../../../../assets/icons/GalleyIcon2';
import SearchIcon from '../../../../assets/icons/SearchIcon';
import NFTItemCard, { NFTItemCardProps } from '../../../../components/NFTItemCard/NFTItemCard';
import NFTItemLoadingCard from '../../../../components/NFTItemLoadingCard/NFTItemLoadingCard';
import './GallerySection.scss';

interface GallerySectionProps {
  isLoading: boolean;
  items: NFTItemCardProps[] | null;
  setCollapseFilterContainer: Function;
}

const GallerySection = (props: GallerySectionProps) => {
  const [showMore, setShowMore] = useState(false);
  return(
    <div className="gallery-section">
      <div className="head">
        <div
          onClick={ () => props.setCollapseFilterContainer(false) }
          className="filter-open-btn"
        >
          <FilterIcon />
        </div>
        <div className="search-bar">
          <SearchIcon />
          <input type="text" placeholder='Search' />
        </div>
        <div className="icons-container">
          <div className="icon" onClick={ () => setShowMore(false)}>
            <GalleryIcon1 isSelected={!showMore} />
          </div>
          <div className="icon" onClick={ () => setShowMore(true)}>
            <GalleryIcon2 isSelected={showMore} />
          </div>
        </div>
      </div>
      <div className={`cards-container ${showMore ? 'show-more' : ''}`}>
        {
          (props.isLoading || !props.items) ? (
            [1,2,3,4,5,6,7,8,8,9].map(() => (
              <NFTItemLoadingCard />
            ))            
          ) : (
            props.items?.map((item, i) => (
              <NFTItemCard
                name={item.name}
                collection={item.collection}
                price={item.price}
                image={item.image}
                id={item.id}
              />
            ))            
          )
        }
      </div>
    </div>
  )
}

export default GallerySection;