import { CollectionCardProps } from "../components/CollectionCard/CollectionCard"
import { TCollection, TItem } from "../pages/CollectionPage/CollectionPage"

export const defaultPopularItems: TItem[] = [
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    collectionTitle: "NFTKingCreator",
    price: 0.5,
    id: "asdasd",
  },
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    collectionTitle: "NFTKingCreator",
    price: 0.5,
    id: "afsdasd",
  },
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    collectionTitle: "NFTKingCreator",
    price: 0.5,
    id: "adssdasd",
  },
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    collectionTitle: "NFTKingCreator",
    price: 0.5,
    id: "asdasdsaklhjlj",
  },
]

export const defaultPopularCollections: CollectionCardProps[] = [
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    id: "asdasd",
    tokenType: "tokenType",
    volTraded: 120,
    description: `3333 generative Kongz conquering NEAR-by jungles.
    Produce Baby Kongz with Breeding | Stake Evil Baby Kongz to steal Baby Kongz. `,
  },
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    id: "asdasd",
    volTraded: 120,
    tokenType: "tokenType",
    description: `3333 generative Kongz conquering NEAR-by jungles.
    Produce Baby Kongz with Breeding | Stake Evil Baby Kongz to steal Baby Kongz`,
  },
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    id: "asdasd",
    volTraded: 120,
    tokenType: "tokenType",
    description: `3333 generative Kongz conquering NEAR-by jungles.
    Produce Baby Kongz with Breeding | Stake Evil Baby Kongz to steal Baby Kongz`,
  },
  {
    image: require("../assets/images/defaultPopularItem1.png"),
    name: "Grouchy Tiger",
    id: "asdasd",
    volTraded: 120,
    tokenType: "tokenType",
    description: `3333 generative Kongz conquering NEAR-by jungles.
    Produce Baby Kongz with Breeding | Stake Evil Baby Kongz to steal Baby Kongz`,
  },
]

export const placeHolderCollection: TCollection = {
  name: "Pixel Birds",
  isVerified: true,
  bannerImageUrl: "",
  tokenType: "tokenType",
  links: {
    discord: "ygvygy",
    twitter: "tg",
    website: "adf",
    telegram: "",
  },
  profileImageUrl: "",
  creator: "The Sandbox Game",
  description: `
    Proro the littel penguin joins the sandbox Matavers. The Land sale will
    take place on septmber 23rd at 1PM UTC with more 800 LANDSs on sale
  `,
  numberOfItems: 3,
  owners: 23,
  floorPrice: 2.3,
  volTraded: 200,
  collectionId: "fdasfasd",
  royalty: 1.3,
}
