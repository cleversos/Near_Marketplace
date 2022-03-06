import React, { useContext, useState } from "react"
import BodyText from "../../../../components/BodyText/BodyText"
import Button from "../../../../components/Button/Button"
import InputBox from "../../../../components/InputBox/InputBox"
import ModalContainer from "../../../../components/ModalContainer/ModalContainer"
import { ConnectionContext } from "../../../../contexts/connection"
import "./TransferModal.scss"

const TransferModal = (props: {
  onClose: Function
  isVisible: boolean
  price: number
  tokenName: string
  onTransfer: Function
}) => {
  const { onClose, isVisible, price, onTransfer, tokenName } = props
  const [receiveAddress, setReceiveAddress] = useState<string>()
  const [validation, setValidation] = useState(false)
  const onInputChange = (event) => {
    setReceiveAddress(event.target.value)
    setValidation(false)
  }
  const handleTransfer = () => {
    if (receiveAddress !== "") {
      onTransfer(receiveAddress)
    } else {
      setValidation(true)
    }
  }
  return (
    <ModalContainer
      onClose={onClose}
      isVisible={isVisible}
      className="transfer-modal"
    >
      <div className="head">
        <BodyText bold className="title">
          Confirm Transfer
        </BodyText>
        <p>You are about to send <span>{tokenName}</span> to:</p>
      </div>
      <div className="body">
        {validation &&
          <div className="text-validation">
            Required Field!
          </div>
        }
        <InputBox
          onInputChange={onInputChange}
          placeholder="Account ID (abc.near)"
          name="amount"
          value={receiveAddress}
          max={price}
        />
        <p className="description">You will be redirected to NEAR Web Wallet to confirm your transaction.</p>
        <Button title="Tranfer" onClick={() => handleTransfer()} disabled={false} />
      </div>
    </ModalContainer>
  )
}

export default TransferModal
