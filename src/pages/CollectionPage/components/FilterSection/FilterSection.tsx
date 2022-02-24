import React, { useState } from "react"
import ArrowBackIcon from "../../../../assets/icons/ArrowBackIcon"
import ChevronDownIcon from "../../../../assets/icons/ChevronDownIcon"
import DollarIcon from "../../../../assets/icons/DollarIcon"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import PriceSelect from "../../../../components/PriceSelect/PriceSelect"
import FilterPriceInput from "../FitlerPriceInput/FilterPriceInput"
import "./FilterSection.scss"

const currencyOptions = [
  {
    currency: "US Dollar",
    symbol: "USD",
    icon: "usd",
  },
  {
    currency: "NEAR Protocol",
    symbol: "NEAR",
    icon: "near",
  },
]

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
  const [selectedCurrency, setSelectedCurrency] = useState("usd")
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
      currency: "USD",
      min: priceMin,
      max: priceMax
    })
    console.log(priceMin, priceMax)
  }

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
            <PriceSelect options={currencyOptions} minValue={priceMin} maxValue={priceMax} setPriceRange={(e) => props.setPriceRange(e)} />
            <FilterPriceInput placeholder="Min" value={priceMin} setValue={(e) => setPriceMin(e)} />
            <FilterPriceInput placeholder="Max" value={priceMax} setValue={(e) => setPriceMax(e)} />
          </div>
        )}

        <Button title="Apply" onClick={() => handleApply()} />
      </div>
    </div>
  )
}

export default FilterSection
