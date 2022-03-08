import React from "react"
import BodyText from "../BodyText/BodyText"
import { IconLoader } from "../IconLoader"
import LoadingCircle from "../LoadingCircle/LoadingCircle"
import "./Button.scss"

interface ButtonProps {
  title: any
  onClick: Function
  className?: string
  secondary?: boolean
  icon?: string
  isLoading?: boolean,
  disabled: boolean
}

const Button = (props: ButtonProps) => {
  const { title, onClick, className, secondary, isLoading, icon, disabled } = props

  return (
    <button
      onClick={() => onClick()}
      disabled={disabled}
      className={`main-button${secondary ? " secondary" : ""} ${className || ""
        }`}
    >
      {isLoading ? <LoadingCircle /> : icon && <IconLoader icon={icon} />}
      <BodyText light={secondary ? true : false}>{title}</BodyText>
    </button>
  )
}

export default Button
