import React, { useState } from "react"
import ArrowBackIcon from "../../../../assets/icons/ArrowBackIcon"
import ChevronDownIcon from "../../../../assets/icons/ChevronDownIcon"
import DollarIcon from "../../../../assets/icons/DollarIcon"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import PriceSelect from "../../../../components/PriceSelect/PriceSelect"
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
}

const FilterSection = (props: FilterSectionProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState("usd")
  const [showPriceOptions, setShowPriceOptions] = useState(true)
  const { collapseFilterContainer, setCollapseFilterContainer } = props

  const toggleCollapse = () => {
    setCollapseFilterContainer(!collapseFilterContainer)
  }

  const togglePriceOptions = () => {
    setShowPriceOptions((current) => !current)
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
            {/* {resolveIcon(currencyOptions[0].icon)} */}
            <PriceSelect options={currencyOptions} />
            <input type="text" placeholder="Min" />
            <input type="text" placeholder="Max" />
          </div>
        )}

        <Button title="Apply" onClick={() => { }} />
      </div>
    </div>
  )
}

export default FilterSection
