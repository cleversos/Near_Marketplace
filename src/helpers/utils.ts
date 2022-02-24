import { TItem } from "../pages/ItemPage/ItemPage"

export const convertTokenResultToItemStruct = (
  item,
  collectionTitle,
  collectionId
): TItem => {
  console.log(item.sale_condition, "this is section item")
  return {
    image: item.metadata.media,
    name: item.metadata.title,
    collectionTitle,
    collectionId,
    price: item.sale_condition?.near,
    id: item.token_id,
    ownerId: item.owner_id,
  }
}
