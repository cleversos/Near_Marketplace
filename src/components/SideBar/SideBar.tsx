import React, { useContext, useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import ExpandIcon from "../../assets/icons/ExpandIcon"
import { ConnectionContext } from "../../contexts/connection"
import BodyText from "../BodyText/BodyText"
import Button from "../Button/Button"
import { IconLoader } from "../IconLoader"
import "./SideBar.scss"

interface SideBarProps {
  openMobileSidebar: boolean
  setOpenMobileSidebar: Function
}
type TLinks = {
  link: string
  name: string
  icon: string
}
const links: TLinks[] = [
  {
    link: "/",
    name: "Home",
    icon: "home",
  },
  {
    link: "/collections",
    name: "Collection",
    icon: "collection",
  },
  {
    link: "/stats",
    name: "Stats",
    icon: "stats",
  },
  {
    link: "/me",
    name: "Profile",
    icon: "profile",
  },
]

const SideBar = (props: SideBarProps) => {
  const sideBarRef = useRef(null)
  const { openMobileSidebar, setOpenMobileSidebar } = props
  const { wallet, signIn } = useContext(ConnectionContext)
  const walletAddress = wallet?.getAccountId()

  useEffect(() => {
    window.onclick = (event) => {
      const menuToggler = document.querySelector(".sidebar-open-btn")
      if (event.target !== sideBarRef.current && event.target !== menuToggler) {
        setOpenMobileSidebar(false)
      }
    }
    return () => {
      window.onclick = null
    }
  }, [sideBarRef, setOpenMobileSidebar])

  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div
      className={`side-bar ${openMobileSidebar ? "show-mobile" : ""} ${isExpanded ? "expanded" : "collapsed"
        }`}
    >
      <ul className="items-container">
        {links.map((link, i) => (
          <li
            className={`${link.link === location.pathname ? "selected" : ""}`} key={i}
          >
            <Link to={link.link}>
              <IconLoader
                icon={link.icon}
                isIconSelected={link.link === location.pathname}
              />
              <BodyText light>{link.name}</BodyText>
            </Link>
          </li>
        ))}
      </ul>
      <div className="bottom-section">
        {walletAddress ? (
          <div className="profile-container">
            <div
              onClick={() => setIsExpanded((current) => !current)}
              className="expand-btn"
            >
              <ExpandIcon />
            </div>
          </div>
        ) : (
          <>
            <div
              onClick={() => setIsExpanded((current) => !current)}
              className="expand-btn"
            >
              <ExpandIcon />
            </div>
            <Button
              icon="wallet"
              className="connect-wallet"
              title="Connect wallet"
              onClick={signIn}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default SideBar
