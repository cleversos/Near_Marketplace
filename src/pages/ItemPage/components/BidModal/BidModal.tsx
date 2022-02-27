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
  const [amount, setAmount] = useState(0)
  const { wallet } = useContext(ConnectionContext)
  const userNearBalance = 20
  const onInputChange = (event) => {
    setAmount(event.target.value)
    //check the amount
    if (amount < Number(price) / 2) {
    } else if (amount > userNearBalance) {
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
        <InputBox
          onInputChange={onInputChange}
          placeholder={`${price}`}
          name="amount"
          value={amount}
          type="number"
        />
        <Button title="Make offer" onClick={() => onMakeBid(amount)} disabled={false} />
      </div>
    </ModalContainer>
  )
}

export default BidModal
