import React, { useContext, useEffect, useRef, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import ChevronDownIcon from "../../assets/icons/ChevronDownIcon"
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
  const [communityShow, setCommunityShow] = useState(false)
  return (
    <div
      className={`side-bar ${openMobileSidebar ? "show-mobile" : ""} ${isExpanded ? "expanded" : "collapsed"
        }`}
    >
      <ul className="items-container">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.link}>
              <IconLoader
                icon={link.icon}
                isIconSelected={link.link === location.pathname}
              />
              <BodyText light>{link.name}</BodyText>
            </Link>
          </li>
        ))}

        <li>
          <a href="https://galacticway.freshteam.com/jobs" target="_blank" rel="noreferrer">
            <IconLoader
              icon="job"
              isIconSelected={false}
            />
            <BodyText light>Job</BodyText>
          </a>
        </li>

        <li>
          <a href="https://airtable.com/shrlLTChvWVKH8M99" target="_blank" rel="noreferrer">
            <IconLoader
              icon="apply"
              isIconSelected={false}
            />
            <BodyText light>Apply listing</BodyText>
          </a>
        </li>
        <li>
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-title" onClick={() => setCommunityShow(!communityShow)}>
              <div className="title-main">
                <IconLoader
                  icon="community"
                  isIconSelected={false}
                />
                {isExpanded &&
                  <BodyText light>Community</BodyText>
                }
              </div>

              {isExpanded &&
                <button>
                  <ChevronDownIcon />
                </button>
              }
            </div>
            {isExpanded &&
              communityShow &&
              <div className="sidebar-dropdown-content">
                <a href="https://twitter.com/GalacticwayNFT" target="_blank" rel="noreferrer" >Twitter</a>
                <a href="https://discord.com/invite/yuBjY6QdR6" target="_blank" rel="noreferrer" >Discord</a>
                <a href="https://help.galacticway.io" target="_blank" rel="noreferrer" >Help Desk</a>
                <a href="https://galacticway.medium.com" target="_blank" rel="noreferrer" >Blog</a>
              </div>
            }
          </div>
        </li>
        <li>
          <Link to="/#">
            <IconLoader
              icon="auctions"
              isIconSelected={location.pathname === "auctions"}
            />
            {isExpanded &&
              <div className="comming-soon">
                <BodyText light>Auctions</BodyText>
                <span className="alert-text">Comming soon</span>
              </div>
            }
          </Link>
        </li>
        <li>
          <Link to="/#">
            <IconLoader
              icon="lanchpad"
              isIconSelected={location.pathname === "lanchpad"}
            />
            {isExpanded &&
              <div className="comming-soon">
                <BodyText light>Lanchpad</BodyText>
                <span className="alert-text">Comming soon</span>
              </div>
            }
          </Link>
        </li>
        {walletAddress &&
          <li className={`${location.pathname.indexOf(walletAddress) !== -1 ? "selected" : ""}`}>
            <Link to={`/profile/@${walletAddress}`}>
              <IconLoader
                icon="profile"
                isIconSelected={location.pathname.indexOf(walletAddress) !== -1}
              />
              <BodyText light>Profile</BodyText>
            </Link>
          </li>
        }
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
              disabled={false}
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
