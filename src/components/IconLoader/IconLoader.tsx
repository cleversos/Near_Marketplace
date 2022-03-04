import React from "react"
import CancelIcon from "../../assets/icons/CancelIcon"
import CollectionIcon from "../../assets/icons/CollectionIcon"
import CreditCardIcon from "../../assets/icons/CreditCardIcon"
import DeleteIcon from "../../assets/icons/DeleteIcon"
import DiscordIcon from "../../assets/icons/DiscordIcon"
import EditIcon from "../../assets/icons/EditIcon"
import HomeIcon from "../../assets/icons/HomeIcon"
import InstagramIcon from "../../assets/icons/InstagramIcon"
import LoadingCircleIcon from "../../assets/icons/LoadingCircleIcon"
import MediumIcon from "../../assets/icons/MediumIcon"
import MenuIcon from "../../assets/icons/MenuIcon"
import MoreIcon from "../../assets/icons/MoreIcon"
import SearchIcon from "../../assets/icons/SearchIcon"
import SettingsIcon from "../../assets/icons/SettingsIcon"
import StatsIcon from "../../assets/icons/StatsIcon"
import TelegramIcon from "../../assets/icons/TelegramIcon"
import TwitterIcon from "../../assets/icons/TwitterIcon"
import WalletIcon from "../../assets/icons/WalletIcon"
import WebsiteIcon from "../../assets/icons/WebsiteIcon"
import ProfileIcon from "../../assets/icons/ProfileIcon"
// import solanaIcon from "../../images/solanaIcon.png";
// import usdcIcon from "../../images/USDCIcon.png";

interface IconLoaderProps {
  icon: string
  isIconSelected?: boolean
}

const resolveIcon = (props: IconLoaderProps): React.ReactNode => {
  switch (props.icon) {
    case "discord":
      return <DiscordIcon />
    case "twitter":
      return <TwitterIcon />
    case "medium":
      return <MediumIcon />
    case "menu":
      return <MenuIcon />
    case "wallet":
      return <WalletIcon />
    case "search":
      return <SearchIcon />
    case "cancel":
      return <CancelIcon />
    case "loading":
      return <LoadingCircleIcon />
    case "creditCard":
      return <CreditCardIcon />
    case "home":
      return <HomeIcon isSelected={props.isIconSelected} />
    case "collection":
      return <CollectionIcon isSelected={props.isIconSelected} />
    case "stats":
      return <StatsIcon isSelected={props.isIconSelected} />
    case "settings":
      return <SettingsIcon isSelected={props.isIconSelected} />
    case "more":
      return <MoreIcon />
    case "website":
      return <WebsiteIcon />
    case "telegram":
      return <TelegramIcon />
    case "instagram":
      return <InstagramIcon />
    case "edit":
      return <EditIcon />
    case "delete":
      return <DeleteIcon />
    case "profile":
      return <ProfileIcon isSelected={props.isIconSelected} />

    default:
      return <div />
  }
}

const IconLoader = ({ icon, isIconSelected = false }: IconLoaderProps) => {
  return (
    <div style={{ display: "flex" }} className="icon-loader">
      {resolveIcon({ icon, isIconSelected })}
    </div>
  )
}

export default IconLoader
