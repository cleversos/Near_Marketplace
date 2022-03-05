import { formatNearAmount } from "near-api-js/lib/utils/format"
import { TItem, TItem1 } from "../pages/ItemPage/ItemPage"

export const convertTokenResultToItemStruct = (
  item,
  collectionTitle,
  collectionId
): TItem => {
  return {
    attribute: item.attribute,
    image: item.metadata.media,
    name: item.metadata.title,
    collectionTitle,
    collectionId,
    price: parseFloat(formatNearAmount(item.sale_conditions.near)),
    id: item.token_id,
    ownerId: item.owner_id,
  }
}

export const convertTokenResultToItemStructItem = (
  item,
  collectionTitle,
  collectionId
): TItem1 => {
  return {
    image: item.metadata.media,
    name: item.metadata.title,
    collectionTitle,
    collectionId,
    price: item.sale_conditions,
    id: item.token_id,
    ownerId: item.owner_id,
  }
}
