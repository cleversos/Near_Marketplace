import { useEffect, useState } from "react"
import ArrowBackIcon from "../../../../assets/icons/ArrowBackIcon"
import ChevronDownIcon from "../../../../assets/icons/ChevronDownIcon"
import AttributeAutocomplete from "../../../../components/AttributeAutocomplete/AttributeAutocomplete"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import FilterPriceInput from "../FitlerPriceInput/FilterPriceInput"
import "./FilterSection.scss"

interface FilterSectionProps {
  collapseFilterContainer: boolean
  setCollapseFilterContainer: Function
  priceRange: PriceRange
  setPriceRange: Function
  attributesFilterOptions: any
  fixFilterData: Function
  attdFilterData: any
}

type PriceRange = {
  currency: string
  min: string
  max: string
}

const FilterSection = (props: FilterSectionProps) => {
  const [showPriceOptions, setShowPriceOptions] = useState(true)
  const [showAttd, setShowAttd] = useState(true)
  const { collapseFilterContainer, setCollapseFilterContainer } = props
  let attdArray: any;
  if (props.attributesFilterOptions !== undefined) {
    attdArray = Array.from(props.attributesFilterOptions, ([name, value]) => ({ name, value }));
  }

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
        <div
          onClick={togglePriceOptions}
          className={`row-container ${!showPriceOptions ? "up" : ""}`}
        >
          <BodyText light>Price</BodyText>
          <ChevronDownIcon />
        </div>
        {showPriceOptions &&
          <>
            <div className="price-options-container">
              <span>Ⓝ NEAR Protocol</span>
              <FilterPriceInput placeholder="Min" value={priceMin} setValue={(e: any) => setPriceMin(e)} />
              <FilterPriceInput placeholder="Max" value={priceMax} setValue={(e: any) => setPriceMax(e)} />
            </div>
            <Button title="Apply" onClick={() => handleApply()} disabled={false} />
          </>
        }

      </div>
      {!collapseFilterContainer &&
        <>
          <div className={`row-container ${!showAttd ? "up" : ""}`} onClick={() => setShowAttd(!showAttd)} style={{ borderTop: showPriceOptions ? "1px solid #20252C" : "1px solid transparent" }}>
            <BodyText light>Attributes</BodyText>
            <ChevronDownIcon />
          </div>
          {showAttd &&
            attdArray !== undefined && attdArray.map((item: any, key) => (
              <AttributeAutocomplete
                key={key}
                options={item}
                fixFilterData={props.fixFilterData}
                attdFilterData={props.attdFilterData}
                originData={attdArray}
              />
            ))}
        </>
      }
    </div>
  )
}

export default FilterSection
