import { formatNearAmount } from "near-api-js/lib/utils/format"
import BodyText from "../../../../components/BodyText/BodyText"
import NFTItemCard from "../../../../components/NFTItemCard/NFTItemCard"
import { TProfileCollection } from "../../ProfilePage"
import "./CollectionAndAllItemsSet.scss"

const CollectionAndAllItemsSet = (props: { collection: TProfileCollection, listedNfts: any }) => {
  const { collection } = props
  console.log(collection.items)
  return (
    <div className="collection-and-items-set">
      <div className="head">
        <img src={collection.imageUrl} alt={collection.name} />
        <BodyText>{collection.name}</BodyText>
        {/* <BodyText light>FLOOR: {collection.floorPrice} Ⓝ</BodyText>
        <BodyText light>
          TOTAL FLOOR VALUE: {collection.floorPrice * collection.items?.length}{" "}
          Ⓝ
        </BodyText> */}
      </div>
      <div className="nfts-container">
        {collection.items?.map((item, i) => (
          // https://ipfs.fleek.co/ipfs/bafkreiapfrxlqvay2eod5nog5dcp25hpb67ihhrctl4xg466j52ssiac6i
          <NFTItemCard
            key={i}
            id={item.id}
            collectionId={collection.id}
            image={item.image}
            name={item.name}
            tokenType={item.tokenType}
            collectionTitle={collection.name}
            price={item.price}
          />
        ))}
        {props.listedNfts?.map((item, i) => (
          collection.id === item.nft_contract_id &&
          <NFTItemCard
            key={i}
            id={item.token_id}
            collectionId={item.nft_contract_id}
            image={item.metadata.media}
            tokenType={item.tokenType}
            name={item.metadata.title}
            collectionTitle={collection.name}
            price={parseFloat(formatNearAmount(item.sale_conditions.near))}
          />
        ))}
      </div>
    </div>
  )
}

export default CollectionAndAllItemsSet
