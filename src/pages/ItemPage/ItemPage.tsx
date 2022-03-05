import { useCallback, useContext, useEffect, useState } from "react"
import { parseNearAmount, formatNearAmount } from "near-api-js/lib/utils/format"
import { Link, useLocation, useParams } from "react-router-dom"
import { createBrowserHistory } from "history"
import HeartIcon from "../../assets/icons/HeartIcon"
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
import { convertTokenResultToItemStructItem } from "../../helpers/utils"
import BidModal from "./components/BidModal/BidModal"
import "./ItemPage.scss"
import { getTransactionsForItem } from '../../contexts/transaction'
import { CONTRACT_ACCOUNT_ID } from '../../config'
import AttributeCard from "./components/AttributeCard/AttributeCard"
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
  approvalId: number
  saleConditions: { near: string }
  ownerId: string
  bids: []
  createdAt: string
  isAuction: boolean
}

export type TItemMarketPlaceDetails = {
  favorites: number
}

const ItemPage = () => {
  const { itemId, collectionId } = useParams()
  const history = createBrowserHistory()
  const [selectedDetailsIndex, setSelectedDetailsIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showBidModal, setShowBidModal] = useState(false)
  const [listingPrice, setListingPrice] = useState("")
  const [priceValidate, setPriceValidate] = useState(true)

  const [item, setItem] = useState<TItem | null>(null)
  const [saleDetails, setSaleDetails] = useState<TItemSalesDetails>(null)
  const [itemMarketDetails, setItemMarketDetails] =
    useState<TItemMarketPlaceDetails>(null)

  const { wallet, signIn, provider } = useContext(ConnectionContext)
  const { contract, contractAccountId } = useContext(ContractContext)

  const isOwner =
    wallet?.getAccountId() === item?.ownerId ||
    wallet?.getAccountId() === saleDetails?.ownerId

  const nearPriceInUSD = 18 //get this from a real source
  const itemPriceInUSD = (
    Number(saleDetails?.saleConditions.near) * nearPriceInUSD
  ).toFixed(2)


  const GAS = "200000000000000"
  const depositSpace = parseNearAmount("0.01")
  const depositFee = parseNearAmount("0.001")
  const oneYocto = "1"

  const handlePrice = (e) => {
    setListingPrice(e)
    setPriceValidate(true)
  }

  const [attributes, setAttributes] = useState<any>([]);

  //TODO fetch item sales details from marketplace
  const fetchItemSalesDetails = useCallback(async () => {
    const saleDetail: any = await provider.query({
      request_type: "call_function",
      account_id: contractAccountId,
      method_name: "get_sale",
      args_base64: btoa(`{"nft_contract_token": "${collectionId}||${itemId}"}`),
      finality: "optimistic",
    })
    const result = JSON.parse(Buffer.from(saleDetail.result).toString())
    if (!result) {
      setSaleDetails(null)
      return
    }
    setSaleDetails({
      approvalId: result.approval_id,
      saleConditions: {
        near: formatNearAmount(result.sale_conditions.near),
      },
      ownerId: result.owner_id,
      bids: result?.bids?.near ? result.bids.near : {},
      createdAt: result.created_at,
      isAuction: result.is_auction,
    })
  }, [])
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  // fetch item token details using itemId from the collection contract
  const fetchItemTokenDetails = useCallback(async () => {
    const rawResult: any = await provider.query({
      request_type: "call_function",
      account_id: collectionId,
      method_name: "nft_token",
      args_base64: btoa(`{"token_id": "${itemId}"}`),
      finality: "optimistic",
    })
    const result = JSON.parse(Buffer.from(rawResult.result).toString())
    console.log(result, "result")
    if (result.metadata.reference !== null) {
      let metadata: any = [];
      try {
        await fetch(`https://ipfs.io/ipfs/${result.metadata.reference}`)
          .then(resp =>
            resp.json()
          ).catch((e) => {
            console.log(e);
          }).then((json) => {
            metadata = json
          })
      } catch (error) {
        console.log(error)
      }
      setAttributes(metadata.attributes);
    }
    setName(result.metadata.title)
    setImage(result.metadata.media)
    setItem(
      convertTokenResultToItemStructItem(result, "collection name", collectionId)
    )
  }, [])

  //Call all fetches
  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetchItemTokenDetails()
      await fetchItemSalesDetails()
      // await getCollectionDetail() //get collection detail data
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [])
  useEffect(() => {
    fetchAll()
    getActivities()
  }, [fetchAll])

  const cancelSale = async () => {
    try {
      await contract.remove_sale(
        {
          nft_contract_id: collectionId,
          token_id: itemId,
        },
        GAS,
        oneYocto
      )
    } catch (error) {
      console.log(error)
    }
  }

  const onBid = async (amount) => {
    try {
      await contract.offer(
        {
          nft_contract_id: item.collectionId,
          token_id: item.id,
        },
        GAS,
        parseNearAmount(amount + depositFee)
      )
    } catch (error) { }
  }

  const onBuy = async () => {
    try {
      await contract.offer(
        {
          nft_contract_id: item.collectionId,
          token_id: item.id,
        },
        GAS,
        parseNearAmount(saleDetails?.saleConditions.near)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOffer = async () => {
    try {
      await contract.accept_offer(
        {
          nft_contract_id: item.collectionId,
          token_id: item.id,
          ft_token_id: "near",
        },
        GAS,
        "0"
      )
      history.replace("/collections")
      window.location.reload()
    } catch (error) { }
  }

  const auctionList = async () => {
    const account: any = wallet.account()
    if (!(listingPrice === "")) {
      try {
        await account.functionCall(
          item.collectionId,
          "nft_approve",
          {
            token_id: item.id,
            account_id: contractAccountId,
            msg: JSON.stringify({
              sale_conditions: {
                near: parseNearAmount(listingPrice)
              },
              is_auction: true
            }),
          },
          GAS,
          depositSpace
        )
      } catch (error) {
        console.log(error)
      }
    } else {
      setPriceValidate(false)
    }
  }


  const [activities, setActivities] = useState<any>([])

  const getActivities = async () => {
    const data = await getTransactionsForItem(CONTRACT_ACCOUNT_ID, collectionId, itemId)
    const txresult = []
    for (let item of data) {
      const rawResult: any = await provider.query({
        request_type: "call_function",
        account_id: item.args.args_json.sale.nft_contract_id,
        method_name: "nft_token",
        args_base64: btoa(`{"token_id": "${item.args.args_json.sale.token_id}"}`),
        finality: "optimistic",
      })
      const newRow = JSON.parse(Buffer.from(rawResult.result).toString())
      txresult.push({
        itemName: newRow.metadata.title,
        itemImageUrl: newRow.metadata.media,
        trxId: item.originated_from_transaction_hash,
        time: item.time,
        amount: formatNearAmount(item.args.args_json.price),
        buyer: item.args.args_json.buyer_id,
        seller: item.args.args_json.sale.owner_id,
      })
    }
    setActivities(txresult)
  }

  useEffect(() => {
    getActivities()
  }, [name, image])

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
            price={parseFloat(saleDetails?.saleConditions.near)}
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
                <BodyText bold className="item-name">
                  {item?.name}
                </BodyText>
                <div className="owners-and-faves-container">
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
                {isOwner && !saleDetails ? (
                  <div className="list-item-container">
                    {!priceValidate &&
                      <p className="required-filed">Required field</p>
                    }
                    <InputBox
                      name="listingPrice"
                      type="number"
                      placeholder="Enter price"
                      value={listingPrice}
                      onInputChange={(event: any) =>
                        handlePrice(event.target.value)
                      }
                    />
                    <Button title="List for Sale" onClick={auctionList}
                      disabled={false} />
                  </div>
                ) : (
                  <>
                    <BodyText light className="label">
                      Current Price
                    </BodyText>
                    <div className="price-container">
                      <BodyText
                        bold
                      >{`${saleDetails?.saleConditions.near} Ⓝ`}</BodyText>
                      <BodyText light>{`( $${formatAmount(
                        Number(itemPriceInUSD),
                        3,
                        ","
                      )} )`}</BodyText>
                    </div>
                    {!wallet?.isSignedIn() ? (
                      <Button
                        icon="wallet"
                        title="Connect Wallet"
                        disabled={false}
                        onClick={signIn}
                      />
                    ) : isOwner ? (
                      <Button title="Cancel listing" onClick={cancelSale}
                        disabled={false} />
                    ) : (
                      <>
                        {(saleDetails?.isAuction) &&
                          <Button
                            title="Buy Now"
                            disabled={false}
                            onClick={onBuy} />
                        }
                        {saleDetails?.isAuction &&
                          < Button
                            // secondary
                            title={saleDetails.bids.length !== undefined && (saleDetails?.bids?.map(function (e: any) { return e.owner_id; }).indexOf(wallet._authData.accountId) !== -1) ? "Update Bid" : "Bid"}
                            // title="Bid"
                            disabled={false}
                            onClick={() => setShowBidModal(true)}
                          />
                        }
                      </>
                    )}
                  </>
                )}
              </div>
              <ChoiceRenderer
                changeHandler={(index) => setSelectedDetailsIndex(index)}
                selected={selectedDetailsIndex}
                components={
                  isOwner && !saleDetails ?
                    [
                      {
                        title: "Attributes",
                        component: (
                          <div className="attributes-container">
                            {attributes?.map((attribute, i) => (
                              <AttributeCard
                                key={i}
                                name={(Object.values(attribute))[0]}
                                value={(Object.values(attribute))[1]}
                              />
                            ))}
                          </div>
                        ),
                      }
                    ]
                    :
                    (
                      saleDetails?.isAuction ? [
                        {
                          title: "Attributes",
                          component: (
                            <div className="attributes-container">
                              {attributes?.map((attribute, i) => (
                                <AttributeCard
                                  key={i}
                                  name={(Object.values(attribute))[0]}
                                  value={(Object.values(attribute))[1]}
                                />
                              ))}
                            </div>
                          ),
                        },
                        {
                          title: "Offers",
                          component: <div className="attributes-container">
                            {isOwner && (saleDetails.bids.length !== undefined && saleDetails?.bids?.length !== 0) &&
                              <button className="main-button" style={{ color: "#fff", width: "100%", margin: "10px 0" }} onClick={() => acceptOffer()}>Accept Offer</button>
                            }
                            {saleDetails.bids.length !== undefined && saleDetails?.bids?.map((item: any, key) => (
                              <div className="bid-item" key={key}>
                                <span>
                                  <Link to={`/profile/@${item.owner_id}`}>
                                    {item.owner_id}
                                  </Link>
                                </span>
                                <span>{parseFloat(formatNearAmount(item.price)).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>,
                        },
                      ]
                        :
                        [
                          {
                            title: "Attributes",
                            component: (
                              <div className="attributes-container">
                                {attributes?.map((attribute, i) => (
                                  <AttributeCard
                                    key={i}
                                    name={(Object.values(attribute))[0]}
                                    value={(Object.values(attribute))[1]}
                                  />
                                ))}
                              </div>
                            ),
                          }
                        ]
                    )

                }
              />
            </div>
          </div>
          <ActivityTable
            activities={activities}
          />
        </>
      )
      }
    </div >
  )
}

export default ItemPage
