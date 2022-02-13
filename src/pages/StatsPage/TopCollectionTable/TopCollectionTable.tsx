import React from 'react';
import BodyText from '../../../components/BodyText/BodyText';
import './TopCollectionTable.scss';

type TCollection = {
  id: string,
  imageUrl: string,
  name: string,
  floorPrice: number,
  prevFloorPrice: number,
  prevVolume: number;
  volume: number,
  prevAvgPrice: number,
  avgPrice: number,
}

export const defaultCollections: TCollection[] = [
  {
    id: 'adfasdf',
    imageUrl: "https://i.imgur.com/D2cmOnL.gif",
    name: "basis.markets",
    prevFloorPrice: 11,
    floorPrice: 12,
    volume: 271.9,
    prevVolume: 300,
    prevAvgPrice: 10.5,
    avgPrice: 11.3,
  },
  {
    id: 'adfasdf',
    imageUrl: "https://dl.airtable.com/.attachmentThumbnails/d087bfe9edf2f6499176ff022fb89df4/d35ec815",
    name: "basis.markets",
    prevFloorPrice: 11,
    floorPrice: 12,
    volume: 271.9,
    prevVolume: 300,
    prevAvgPrice: 10.5,
    avgPrice: 11.3,
  },
]

const TopCollectionTable = () => {
  return(
    <table className="top-collection-table">
      <thead>
        <tr>
          <th><BodyText light>#</BodyText></th>
          <th><BodyText light>Items</BodyText></th>
          <th><BodyText light>NFT Floor Price</BodyText></th>
          <th><BodyText light>Volume %</BodyText></th>
          <th><BodyText light>Volume</BodyText></th>
          <th><BodyText light>Avg Price</BodyText></th>
          <th><BodyText light>Avg Price %</BodyText></th>
          <th><BodyText light>Me Floor %</BodyText></th>
        </tr>
      </thead>
      <tbody>
        {defaultCollections.map((collection, i) => 
          <tr key={i}>
            <td className='number'><BodyText>{i + 1}</BodyText></td>
            <td>
              <div className="collection-name-and-img-column">
                <img src={collection.imageUrl} alt={collection.name} />
                <BodyText className="collection-title">{collection.name}</BodyText>
              </div>
            </td>
            <td>
              <BodyText className="mobile-title">NFT Floor Price</BodyText>
              <BodyText light>{collection.floorPrice}</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Volume %</BodyText>
              <BodyText light className={collection.volume - collection.prevVolume < 0 ? "red" : "green"}>
                {
                  `${((collection.volume - collection.prevVolume)/collection.prevVolume * 100).toFixed(2)}%`
                }
              </BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Volume</BodyText>
              <BodyText light>{collection.volume}</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Avg Price</BodyText>
              <BodyText light>{collection.avgPrice}</BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Avg Price %</BodyText>
              <BodyText light className={collection.avgPrice - collection.prevAvgPrice < 0 ? "red" : "green"}>
                {
                  `${((collection.avgPrice - collection.prevAvgPrice)/collection.prevAvgPrice * 100).toFixed(2)}%`
                }
              </BodyText>
            </td>
            <td>
              <BodyText className="mobile-title">Me Floor %</BodyText>
              <BodyText light className={collection.floorPrice - collection.prevFloorPrice < 0 ? "red" : "green"}>
                {
                  `${((collection.floorPrice - collection.prevFloorPrice)/collection.prevFloorPrice * 100).toFixed(2)}%`
                }
              </BodyText>
            </td>
          </tr>
        )}
      </tbody>
    </table>    
  )
}

export default TopCollectionTable;