import { formatNearAmount } from "near-api-js/lib/utils/format"
import { TItem, TItem1, TItemListed } from "../pages/ItemPage/ItemPage"

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
    tokenType: item.tokenType,
    createdAt: item.created_at,
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
    tokenType: item.tokenType,
    collectionId,
    price: item.sale_conditions,
    id: item.token_id,
    ownerId: item.owner_id,
  }
}

export const convertTokenResultToItemStructItemProfile = (
  item,
  collectionTitle,
  collectionId
): TItem1 => {
  return {
    image: item.baseUri !== undefined ? `${item.baseUri}/${item.metadata.media}` : item.metadata.media,
    name: item.metadata.title,
    collectionTitle,
    tokenType: item.tokenType,
    collectionId,
    price: item.sale_conditions,
    id: item.token_id,
    ownerId: item.owner_id,
  }
}

export const convertTokenResultToItemStructItemProfileListed = (
  item,
  collectionTitle,
  collectionId
): TItemListed => {
  return {
    image: item.baseUri !== undefined ? `${item.baseUri}/${item.metadata.media}` : item.metadata.media,
    name: item.metadata.title,
    collectionTitle,
    bids: item.bids,
    tokenType: item.token_type,
    collectionId,
    price: item.sale_conditions,
    id: item.token_id,
    ownerId: item.owner_id,
  }
}


export const convertTokenResultToItemStructCollection = (
  item,
  collectionTitle,
  collectionId
): TItem => {
  return {
    attribute: item.attribute,
    image: `${item.baseUri}/${item.metadata.media}`,
    name: item.metadata.title,
    collectionTitle,
    collectionId,
    tokenType: item.tokenType,
    createdAt: item.created_at,
    price: parseFloat(formatNearAmount(item.sale_conditions.near)),
    id: item.token_id,
    ownerId: item.owner_id,
  }
}
