// import { useContext, useEffect, useState } from "react"
import BodyText from "../../components/BodyText/BodyText"
// import ToggleButton from "../../components/ToggleButton/ToggleButton"
import "./StatsPage.scss"
import TopCollectionTable from "./TopCollectionTable/TopCollectionTable"

const StatsPage = () => {
  // const [timeRange, setTimeRange] = useState<1 | 7 | 30>(1)
  return (
    <div className="stats-page">
      <div className="head">
        <BodyText bold>Top Collections</BodyText>
        <BodyText light>
          The top NFTs on Galacticway, ranked by volume, floor price and other
          statistics.
        </BodyText>
      </div>
      <div className="table-container" style={{ marginTop: 20 }}>
        <div className="table-filters-container">
          {/* <div className="sort-select-container">
            <select className="sort-select">
              <option>Highest Listed</option>
              <option>Highest Listed</option>
            </select>
          </div> */}
          {/* <ToggleButton
            buttons={[
              {
                title: "1 Day",
                onClick: () => setTimeRange(1),
              },
              {
                title: "7 Day",
                onClick: () => setTimeRange(7),
              },
              {
                title: "30 Day",
                onClick: () => setTimeRange(30),
              },
            ]}
          /> */}
        </div>
        <TopCollectionTable />
      </div>
    </div>
  )
}

export default StatsPage
