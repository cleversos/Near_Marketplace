import { METHODS } from "http"
import { parseNearAmount } from "near-api-js/lib/utils/format"
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
import { convertTokenResultToItemStruct } from "../../helpers/utils"
import AttributeCard from "./components/AttributeCard/AttributeCard"
import BidModal from "./components/BidModal/BidModal"
import "./ItemPage.scss"

//////////////////////////////////
//please add gas and required deposit in all transaction METHODS.
//collection/nft_contract_id/token_type page does not shows listed items
//please fix saleArg as I wrote.
//////////////////////////////////

type TAttributes = {
  name: string
  value: string
}

export type TItem = {
  image: any
  name: string
  collectionTitle: string
  collectionId: string
  price: number
  id: string
  ownerId: string
}

export type TItemSalesDetails = {
  price: NumberConstructor
}

export type TItemMarketPlaceDetails = {
  favorites: number
}

const ItemPage = () => {
  const { itemId, collectionId } = useParams()

  const [selectedDetailsIndex, setSelectedDetailsIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showBidModal, setShowBidModal] = useState(false)
  const [listingPrice, setListingPrice] = useState()

  const [item, setItem] = useState<TItem | null>(null)
  const [salesDetail, setSalesDetail] = useState<TItemSalesDetails>(null)
  const [itemMarketDetails, setItemMarketDetails] =
    useState<TItemMarketPlaceDetails>(null)

  const { wallet, signIn, provider } = useContext(ConnectionContext)
  const { contract, contractAccountId } = useContext(ContractContext)

  const isOwner = wallet?.getAccountId() === item?.ownerId

  const nearPriceInUSD = 18 //get this from a real source
  const itemPriceInUSD = ((item?.price || 0) * nearPriceInUSD).toFixed(2)

  // fetch item sales details from marketplace
  const fetchItemSalesDetails = useCallback(async () => {
    try {
      //get sales details
      const salesDetail = await provider.query({
        request_type: "call_function",
        account_id: contractAccountId,
        method_name: "nft_token",
        args_base64: btoa(`{"token_id": "${itemId}"}`),
        finality: "optimistic",
      })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }, [])

  // fetch item sales details from marketplace
  const fetchItemMarketplaceDetails = useCallback(async () => {
    try {
      //get sales details
      const salesDetail = await provider.query({
        request_type: "call_function",
        account_id: contractAccountId,
        method_name: "nft_token",
        args_base64: btoa(`{"token_id": "${itemId}"}`),
        finality: "optimistic",
      })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }, [])

  // fetch item details using itemId from the collection contract
  const fetchItemDetails = useCallback(async () => {
    try {
      //get token details
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: collectionId,
        method_name: "nft_token",
        args_base64: btoa(`{"token_id": "${itemId}"}`),
        finality: "optimistic",
      })
      const result = JSON.parse(Buffer.from(rawResult.result).toString())
      setItem(
        convertTokenResultToItemStruct(result, "collection name", collectionId)
      )
      console.log({ result })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchItemDetails()
  }, [fetchItemDetails])

  const cancelSale = async () => {
    try {
      await contract.remove_sale({
        arg_name: {
          nft_contract_id: item.collectionId,
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
          nft_contract_id: item.collectionId,
          token_id: item.id,
          ft_token_id: "near",
          price: parseNearAmount("10"),
        },
      })
    } catch (error) {}
  }

  const onBid = async (amount) => {
    try {
      await contract.offer(
        {
          nft_contract_id: item.collectionId,
          token_id: item.id,
        },
        null, //gas
        parseNearAmount(amount)
      )
    } catch (error) {}
  }

  const acceptOffer = async () => {
    try {
      await contract.accept_offer({
        arg_name: {
          nft_contract_id: item.collectionId,
          token_id: item.id,
          ft_token_id: "near",
        },
      })
    } catch (error) {}
  }

  const listItem = async () => {
    const account: any = wallet.account()
    try {
      await account.functionCall(
        item.collectionId,
        "nft_approve",
        {
          token_id: item.id,
          account_id: contractAccountId,
          msg: JSON.stringify({
            sale_conditions: {
              "near": parseNearAmount(listingPrice),
            },
          }),
        },
        "200000000000000",
        parseNearAmount("0.01")
      )
    } catch (error) {
      console.log(error)
    }
  }

  const onBuy = async () => {
    try {
      console.log(item)
      await contract.offer(
        {
          nft_contract_id: item.collectionId,
          token_id: item.id,
        },
        "200000000000000", //gas
        parseNearAmount("1.0") //parseNearAmount(item.price.toString()) item.price is undefined
      )
    } catch (error) {
      console.log(error)
    }
  }

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
            price={item?.price}
            onMakeBid={onBid}
          />
          <div className="content">
            <div className="left-side">
              <ImageWithLoadBg
                aspectRatio={1}
                src={item.image}
                alt="placeholder nft"
              />
            </div>
            <div className="right-side">
              <div className="first-detail-set">
                <div className="row-container">
                  <BodyText light>{item?.collectionTitle}</BodyText>
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
                  {itemMarketDetails?.favorites && (
                    <div className="faves-container">
                      <HeartIcon />
                      <BodyText
                        light
                      >{`${itemMarketDetails?.favorites} Favorites`}</BodyText>
                    </div>
                  )}
                </div>
              </div>
              <div className="price-detail-container">
                {isOwner && !salesDetail ? (
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
                    {!wallet?.isSignedIn() ? (
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
                        {/* {item?.attributes?.map((attribute, i) => (
                          <AttributeCard
                            name={attribute.name}
                            value={attribute.value}
                          />
                        ))} */}
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
