import React, { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import HeartIcon from "../../assets/icons/HeartIcon"
import MoreOptionsIcon from "../../assets/icons/MoreOptionsIcon"
import OwnersIcon from "../../assets/icons/OwnersIcon"
import RefreshIcon from "../../assets/icons/RefreshIcon"
import ShareIcon from "../../assets/icons/ShareIcon"
import ActivityTable from "../../components/ActivityTable/ActivityTable"
import BodyText from "../../components/BodyText/BodyText"
import Button from "../../components/Button/Button"
import { ChoiceRenderer } from "../../components/ChoiceRenderer"
import ImageWithLoadBg from "../../components/ImageWithLoadBg/ImageWithLoadBg"
import InputBox from "../../components/InputBox/InputBox"
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle"
import { ConnectionContext } from "../../contexts/connection"
import { ContractContext } from "../../contexts/contract"
import formatAmount from "../../helpers/formatAmount"
import AttributeCard from "./components/AttributeCard/AttributeCard"
import BidModal from "./components/BidModal/BidModal"
import "./ItemPage.scss"

type TAttributes = {
  name: string
  value: string
}

type TItem = {
  favorites: number
  price: number
  attributes: TAttributes[]
  id: string
  ownerId: string
  contractId: string
  name: string
  collectionName: string
  imageUrl: string
  isOnSale: boolean
}

const placeHolderItem: TItem = {
  name: "Anatomy Science Ape Club #1700",
  collectionName: "Anatomy Science Ape Club",
  imageUrl: "",
  favorites: 23,
  price: 530,
  attributes: [
    {
      name: "background",
      value: "red",
    },
    {
      name: "eye",
      value: "blue",
    },
    {
      name: "background",
      value: "red",
    },
    {
      name: "eye",
      value: "blue",
    },
  ],
  id: "faofd",
  ownerId: "hashdaan.testnet",
  contractId: "string",
  isOnSale: true,
}

const ItemPage = () => {
  const [selectedDetailsIndex, setSelectedDetailsIndex] = useState(0)
  const [item, setItem] = useState<TItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { itemId } = useParams()
  const { wallet, signIn } = useContext(ConnectionContext)
  const { contract } = useContext(ContractContext)
  const [showBidModal, setShowBidModal] = useState(false)
  const [listingPrice, setListingPrice] = useState()
  const isOwner = wallet?.getAccountId() === item?.ownerId

  const nearPriceInUSD = 18 //get this from a real source
  const itemPriceInUSD = ((item?.price || 0) * nearPriceInUSD).toFixed(2)

  // fetch item details using itemId
  const fetchItemDetails = useCallback(async () => {
    try {
      const result: TItem = placeHolderItem
      setItem(result)
    } catch (error) {}
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchItemDetails()
  }, [fetchItemDetails])

  const cancelSale = async () => {
    try {
      await contract.remove_sale({
        arg_name: {
          nft_contract_id: item.contractId,
          token_id: item.id,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updatePrice = async () => {
    try {
      await contract.update_price({
        arg_name: {
          nft_contract_id: item.contractId,
          token_id: item.id,
          ft_token_id: "string",
          price: 10,
        },
      })
    } catch (error) {}
  }

  const makeOffer = async (amount) => {
    try {
      await contract.offer({
        nft_contract_id: item.contractId,
        token_id: item.id,
      })
    } catch (error) {}
  }

  const acceptOffer = async () => {
    try {
      await contract.accept_offer({
        arg_name: {
          nft_contract_id: item.contractId,
          token_id: item.id,
          ft_token_id: "ft_token_id",
        },
      })
    } catch (error) {}
  }

  const listItem = async () => {}

  const onBuy = () => {}

  return (
    <div className="item-page">
      {isLoading ? (
        <div className="loading-container">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <BidModal
            onClose={() => setShowBidModal(false)}
            isVisible={showBidModal}
            price={item.price}
            onMakeBid={makeOffer}
          />
          <div className="content">
            <div className="left-side">
              <ImageWithLoadBg
                aspectRatio={1}
                src={require("../../assets/images/placeHolderNFT.png")} //replace with item.imageUrl
                alt="placeholder nft"
              />
            </div>
            <div className="right-side">
              <div className="first-detail-set">
                <div className="row-container">
                  <BodyText light>{item?.collectionName}</BodyText>
                  <div className="icons-container">
                    <div className="share-btn icon">
                      <ShareIcon />
                    </div>
                    <div className="refresh-btn icon">
                      <RefreshIcon />
                    </div>
                    <div className="more-options-btn icon">
                      <MoreOptionsIcon />
                    </div>
                  </div>
                </div>
                <BodyText bold className="item-name">
                  {item?.name}
                </BodyText>
                <div className="owners-and-faves-container">
                  <div className="owners-container">
                    <OwnersIcon />
                    <BodyText light>Owners</BodyText>
                  </div>
                  <div className="faves-container">
                    <HeartIcon />
                    <BodyText light>{`${item?.favorites} Favorites`}</BodyText>
                  </div>
                </div>
              </div>
              <div className="price-detail-container">
                {isOwner && !item.isOnSale ? (
                  <div className="list-item-container">
                    <InputBox
                      name="listingPrice"
                      type="number"
                      placeholder="Enter price"
                      value={listingPrice}
                      onInputChange={(event) =>
                        setListingPrice(event.target.value)
                      }
                    />
                    <Button title="List" onClick={listItem} />
                  </div>
                ) : (
                  <>
                    <BodyText light className="label">
                      Current Price
                    </BodyText>
                    <div className="price-container">
                      <BodyText bold>{`${item?.price} Ⓝ`}</BodyText>
                      <BodyText light>{`$${formatAmount(
                        Number(itemPriceInUSD),
                        3,
                        ","
                      )}`}</BodyText>
                    </div>
                    {!wallet?.isSignedIn ? (
                      <Button
                        icon="wallet"
                        title="Connect Wallet"
                        onClick={signIn}
                      />
                    ) : isOwner ? (
                      <Button title="Cancel listing" onClick={cancelSale} />
                    ) : (
                      <>
                        <Button title="Buy Now" onClick={onBuy} />
                        <Button
                          secondary
                          title="Bid"
                          onClick={() => setShowBidModal(true)}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
              <ChoiceRenderer
                changeHandler={(index) => setSelectedDetailsIndex(index)}
                selected={selectedDetailsIndex}
                components={[
                  {
                    title: "Attributes",
                    component: (
                      <div className="attributes-container">
                        {item?.attributes.map((attribute, i) => (
                          <AttributeCard
                            name={attribute.name}
                            value={attribute.value}
                          />
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Details",
                    component: <div></div>,
                  },
                  {
                    title: "Offers",
                    component: <div></div>,
                  },
                ]}
              />
            </div>
          </div>
          <ActivityTable
            activities={[
              {
                itemName: "Stressed Coders #2352",
                itemImageUrl:
                  "https://cdn.magiceden.io/rs:fill:40:40:0:0/plain/https://arweave.net/L1DNqHMvx9ngzWSAp5DSibVUo6YWDTdLXAjAAzTdvvs/1663.png",
                trxType: "Listing",
                trxId: "sadfasdfasuf",
                time: 1644130878,
                amount: 15.8,
                buyer: "jafasoiuqpwruwwqruqwlwerqwu",
                seller: "jskafoieurwafsdjdaklsdfadf",
              },
            ]}
          />
        </>
      )}
    </div>
  )
}

export default ItemPage
