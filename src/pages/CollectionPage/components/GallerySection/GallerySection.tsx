import { useEffect, useState } from "react"
import * as React from 'react';
import FilterIcon from "../../../../assets/icons/FilterIcon"
import GalleryIcon1 from "../../../../assets/icons/GalleryIcon1"
import GalleryIcon2 from "../../../../assets/icons/GalleyIcon2"
import SearchIcon from "../../../../assets/icons/SearchIcon"
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
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
  tokenType: string
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

  let sortedArray = props.items

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
        for (let attdItem of props.attdFilterData) {
          if (attdItem.name === subItem.trait_type && attdItem.value.indexOf(subItem.value) === -1) {
            attdState = false
          }
        }
      }
    }
    return attdState && priceAndSearchState
  }
  const [sortMethod, setSortMethod] = useState("sort-l-h");
  const handleSort = (e) => {
    setSortMethod(e)
  }

  const [forceRender, setForceRender] = useState(false)

  useEffect(() => {
    if (sortMethod === "sort-recent") {
      sortedArray.sort(function (a: any, b: any) {
        return parseInt(b.createdAt) - parseInt(a.createdAt)
      })
      setForceRender(!forceRender)
    } else if (sortMethod === "sort-l-h") {
      sortedArray.sort(function (a: any, b: any) {
        return parseFloat(a.price) - parseFloat(b.price)
      })
      setForceRender(!forceRender)
    } else if (sortMethod === "sort-h-l") {
      sortedArray.sort(function (a: any, b: any) {
        return parseFloat(b.price) - parseFloat(a.price)
      })
      setForceRender(!forceRender)
    }
  }, [sortMethod])

  useEffect(() => {
    sortedArray = props.items
    setForceRender(!forceRender)
  }, [])

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
        <div className="sort-by">
          <CustomSelect defaultValue={"sort-l-h"} value={sortMethod} onChange={(e) => handleSort(e)}>
            <StyledOption value={"sort-l-h"}>Lowest Price</StyledOption>
            <StyledOption value={"sort-h-l"}>Highest price</StyledOption>
            <StyledOption value={"sort-recent"}>Newly listed</StyledOption>
          </CustomSelect>
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
          : sortedArray?.map((item, i) => (
            getShowAble(item)
            &&
            <NFTItemCard
              key={i}
              name={item.name}
              collectionTitle={item.collectionTitle}
              collectionId={props.collectionId}
              tokenType={props.tokenType}
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

const StyledButton = styled('button')(
  ({ theme }) => `
  font-size: 13px;
  box-sizing: border-box;
  min-height: calc(1.5em + 16px);
  min-width: 150px;
  background: #111321;
  border: 1px solid #111321;
  border-radius: 4px;
  margin: 0.5em;
  padding: 9px;
  text-align: left;
  line-height: 1.5;
  color: #dbdbdba6;

  &:hover {
    background: #111321;
    border-color: #111321;
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid #13162b;
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
  `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 10px 0;
  min-width: 150px;
  background: #111321;
  border: 1px solid #111321;
  border-radius: 4px;
  color: #dbdbdba6;
  overflow: auto;
  outline: 0px;
  `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 4px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: #1a1d33;
    color: #fff;
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: #E7EBF0;
    color: #1A2027;
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: #1a1d33;
    color: #fff;
  }

  &.${optionUnstyledClasses.disabled} {
    color: #111321;
  }

  `,
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;

const CustomSelect = React.forwardRef(function CustomSelect<TValue>(
  props: SelectUnstyledProps<TValue>,
  ref: React.ForwardedRef<HTMLUListElement>,
) {
  const components: SelectUnstyledProps<TValue>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
}) as <TValue>(
    props: SelectUnstyledProps<TValue> & React.RefAttributes<HTMLUListElement>,
  ) => JSX.Element;