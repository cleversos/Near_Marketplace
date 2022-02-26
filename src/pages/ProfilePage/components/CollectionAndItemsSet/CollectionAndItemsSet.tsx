import { useEffect } from "react"
import BodyText from "../../../../components/BodyText/BodyText"
import NFTItemCard from "../../../../components/NFTItemCard/NFTItemCard"
import { TProfileCollection } from "../../ProfilePage"
import "./CollectionAndItemsSet.scss"

const CollectionAndItemsSet = (props: { collection: TProfileCollection }) => {
  const { collection } = props
  useEffect(() => {
    console.log(collection, "collection list")
  }, [])
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
            key={i}
            id={item.id}
            collectionId={collection.id}
            // image={item.image}
            image="https://cdn.magiceden.io/rs:fill:400:400:0:0/plain/https://www.arweave.net/rU07DkAFatGgd5BIzoFt_nws0NE78iDKgcV8xArC9W4?ext=png"
            name={item.name}
            collectionTitle={collection.name}
            price={item.price}
          />
        ))}
        {collection.items?.map((item, i) => (
          <NFTItemCard
            key={i}
            id={item.id}
            collectionId={collection.id}
            // image={item.image}
            image="https://cdn.magiceden.io/rs:fill:400:400:0:0/plain/https://www.arweave.net/rU07DkAFatGgd5BIzoFt_nws0NE78iDKgcV8xArC9W4?ext=png"
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
