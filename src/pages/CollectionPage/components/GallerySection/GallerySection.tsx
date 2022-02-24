import { useState } from "react"
import FilterIcon from "../../../../assets/icons/FilterIcon"
import GalleryIcon1 from "../../../../assets/icons/GalleryIcon1"
import GalleryIcon2 from "../../../../assets/icons/GalleyIcon2"
import SearchIcon from "../../../../assets/icons/SearchIcon"
import NFTItemCard, {
  NFTItemCardProps,
} from "../../../../components/NFTItemCard/NFTItemCard"
import NFTItemLoadingCard from "../../../../components/NFTItemLoadingCard/NFTItemLoadingCard"
import "./GallerySection.scss"

interface GallerySectionProps {
  isLoading: boolean
  items: NFTItemCardProps[] | null
  setCollapseFilterContainer: Function
  collectionId: string
}

const GallerySection = (props: GallerySectionProps) => {
  const [showMore, setShowMore] = useState(false)
  return (
    <div className="gallery-section">
      <div className="head">
        <div
          onClick={() => props.setCollapseFilterContainer(false)}
          className="filter-open-btn"
        >
          <FilterIcon />
        </div>
        <div className="search-bar">
          <SearchIcon />
          <input type="text" placeholder="Search" />
        </div>
        <div className="icons-container">
          <div className="icon" onClick={() => setShowMore(false)}>
            <GalleryIcon1 isSelected={!showMore} />
          </div>
          <div className="icon" onClick={() => setShowMore(true)}>
            <GalleryIcon2 isSelected={showMore} />
          </div>
        </div>
      </div>
      <div className={`cards-container ${showMore ? "show-more" : ""}`}>
        {props.isLoading || !props.items
          ? [1, 2, 3, 4, 5, 6, 7, 8, 8, 9].map((item, key) => <NFTItemLoadingCard key={key} />)
          : props.items?.map((item, i) => (
            <NFTItemCard
              key={i}
              name={item.name}
              collectionTitle={item.collectionTitle}
              collectionId={props.collectionId}
              price={item.price}
              image="https://content.solsea.io/files/thumbnail/1645619337748-2199247.jpg"
              // image={item.image}
              id={item.id}
            />
          ))}
      </div>
    </div>
  )
}

export default GallerySection
