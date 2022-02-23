import { TItem } from "../pages/ItemPage/ItemPage"

export const convertTokenResultToItemStruct = (
  item,
  collectionTitle,
  collectionId
): TItem => {
  return {
    image: item.metadata.media,
    name: item.metadata.title,
    collectionTitle,
    collectionId,
    price: item.sale_condition,
    id: item.token_id,
    ownerId: item.owner_id,
  }
}
