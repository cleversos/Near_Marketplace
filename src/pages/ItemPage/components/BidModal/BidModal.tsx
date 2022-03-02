import React, { useContext, useState } from "react"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import InputBox from "../../../../components/InputBox/InputBox"
import ModalContainer from "../../../../components/ModalContainer/ModalContainer"
import { ConnectionContext } from "../../../../contexts/connection"
import "./BidModal.scss"

const BidModal = (props: {
  onClose: Function
  isVisible: boolean
  price: number
  onMakeBid: Function
}) => {
  const { onClose, isVisible, price, onMakeBid } = props
  const [amount, setAmount] = useState<number>()
  const { wallet } = useContext(ConnectionContext)
  const [validation, setValidation] = useState(false)
  const onInputChange = (event) => {
    setAmount(event.target.value)
    setValidation(false)
  }
  const handleBid = () => {
    if (amount <= price) {
      onMakeBid(amount)
    } else {
      setValidation(true)
    }
  }
  return (
    <ModalContainer
      onClose={onClose}
      isVisible={isVisible}
      className="bid-modal"
    >
      <div className="head">
        <BodyText bold className="title">
          Make an offer
        </BodyText>
      </div>
      <div className="body">
        {validation &&
          <div className="text-validation">
            This value can't bid then {price} Ⓝ
          </div>
        }
        <InputBox
          onInputChange={onInputChange}
          placeholder={`${price}`}
          name="amount"
          value={amount}
          type="number"
          max={price}
        />
        <Button title="Make offer" onClick={() => handleBid()} disabled={false} />
      </div>
    </ModalContainer>
  )
}

export default BidModal
