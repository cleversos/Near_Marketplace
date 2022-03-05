import { useEffect, useState } from "react"
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
  priceRange: PriceRange
  attdFilterData: any
}

interface PriceRange {
  currency: string
  min: string
  max: string
}
const GallerySection = (props: GallerySectionProps) => {
  const [showMore, setShowMore] = useState(false)
  const [searchString, setSearchString] = useState<string>("")

  const getShowAble = (item: any) => {

    const priceAndSearchState = ((props.priceRange.max === "" && props.priceRange.min === "") ||
      (props.priceRange.max === "" && item.price >= parseFloat(props.priceRange.min)) ||
      (props.priceRange.min === "" && item.price <= parseFloat(props.priceRange.max)) ||
      (item.price >= parseFloat(props.priceRange.min) && item.price < parseFloat(props.priceRange.max))) &&
      ((item.name + item.image + item.price).toLowerCase().indexOf(searchString) !== -1 || searchString === "")
    let attdState = true

    let newArray: any = []
    for (let item of props.attdFilterData) {
      newArray.push(...item.value)
    }
    if (props.attdFilterData !== undefined) {
      for (let subItem of item.attribute) {
        if ((newArray).indexOf(subItem.value) === -1) {
          attdState = false
        }
      }
    }
    return attdState && priceAndSearchState
  }

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
          <input type="text" value={searchString} placeholder="Search" onChange={(e) => setSearchString(e.target.value)} />
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
            getShowAble(item)
            &&
            <NFTItemCard
              key={i}
              name={item.name}
              collectionTitle={item.collectionTitle}
              collectionId={props.collectionId}
              price={item.price}
              image={item.image}
              id={item.id}
            />
          ))}
      </div>
    </div>
  )
}

export default GallerySection
