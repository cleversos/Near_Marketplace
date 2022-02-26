import { useEffect, useState } from "react"
import ArrowBackIcon from "../../../../assets/icons/ArrowBackIcon"
import ChevronDownIcon from "../../../../assets/icons/ChevronDownIcon"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import FilterPriceInput from "../FitlerPriceInput/FilterPriceInput"
import "./FilterSection.scss"

interface FilterSectionProps {
  collapseFilterContainer: boolean
  setCollapseFilterContainer: Function
  priceRange: PriceRange
  setPriceRange: Function
}

type PriceRange = {
  currency: string
  min: string
  max: string
}

const FilterSection = (props: FilterSectionProps) => {
  const [showPriceOptions, setShowPriceOptions] = useState(true)
  const { collapseFilterContainer, setCollapseFilterContainer } = props

  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")

  const toggleCollapse = () => {
    setCollapseFilterContainer(!collapseFilterContainer)
  }

  const togglePriceOptions = () => {
    setShowPriceOptions((current) => !current)
  }

  const handleApply = () => {
    props.setPriceRange({
      currency: "Near",
      min: priceMin,
      max: priceMax
    })
    console.log(priceMin, priceMax)
  }
  useEffect(() => {
    handleApply()
  }, [])
  return (
    <div
      className={`filter-section ${collapseFilterContainer ? "hidden" : ""}`}
    >
      <div onClick={toggleCollapse} className="row-container head">
        <BodyText light>Filter</BodyText>
        <div
          className={`toggle-hidden-btn ${collapseFilterContainer ? "front" : ""
            }`}
        >
          <ArrowBackIcon />
        </div>
      </div>
      <div className="section-body">
        <div className="row-container">
          <BodyText light>Status</BodyText>
          <ChevronDownIcon />
        </div>
        <div
          onClick={togglePriceOptions}
          className={`row-container ${!showPriceOptions ? "up" : ""}`}
        >
          <BodyText light>Price</BodyText>
          <ChevronDownIcon />
        </div>
        {showPriceOptions && (
          <div className="price-options-container">
            <span>Ⓝ NEAR Protocol</span>
            <FilterPriceInput placeholder="Min" value={priceMin} setValue={(e) => setPriceMin(e)} />
            <FilterPriceInput placeholder="Max" value={priceMax} setValue={(e) => setPriceMax(e)} />
          </div>
        )}

        <Button title="Apply" onClick={() => handleApply()} disabled={false} />
      </div>
    </div>
  )
}

export default FilterSection
