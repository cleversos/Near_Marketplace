import React from "react"
import BodyText from "../../../../components/BodyText/BodyText"
import NFTItemCard from "../../../../components/NFTItemCard/NFTItemCard"
import { TProfileCollection } from "../../ProfilePage"
import "./CollectionAndItemsSet.scss"

const CollectionAndItemsSet = (props: { collection: TProfileCollection }) => {
  const { collection } = props
  return (
    <div className="collection-and-items-set">
      <div className="head">
        <img src={collection.imageUrl} alt={collection.name} />
        <BodyText>{collection.name}</BodyText>
        <BodyText light>FLOOR: {collection.floorPrice} Ⓝ</BodyText>
        <BodyText light>
          TOTAL FLOOR VALUE: {collection.floorPrice * collection.items?.length}{" "}
          Ⓝ
        </BodyText>
      </div>
      <div className="nfts-container">
        {collection.items?.map((item, i) => (
          <NFTItemCard
            id={item.id}
            collectionId={collection.id}
            image={item.image}
            name={item.name}
            collectionTitle={collection.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default CollectionAndItemsSet
