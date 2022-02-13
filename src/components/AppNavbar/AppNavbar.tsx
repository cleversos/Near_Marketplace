import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeNavMenu from '../HomeNavMenu/HomeNavMenu';
import VolumeAndLangBar from '../VolumeAndLangBar/VolumeAndLangBar';
import BodyText from '../BodyText/BodyText';
import Button from '../Button/Button';
import CollectionSearchBox from '../CollectionSearchBox/CollectionSearchBox';
import { IconLoader } from '../IconLoader';
import './AppNavbar.scss';
import { WalletContext } from '../../contexts/wallet';

interface AppNavbarProps {
  setOpenSidebar: Function;
  dailyVolume: number;
  totalVolume: number;
  showVolBar: boolean;
}
const AppNavbar = (props: AppNavbarProps) => {
  const [expandSearchBox, setExpandSearchBox] = useState(false);
  const [showMobileNavMenu, setShowMobileNavMenu] = useState(false);
  // const {walletAddress} = useContext(WalletContext);
  const walletAddress = 'FZXg6PdjCjoz54TTT5Tvq97Y9hnpWCLsCqPmfCHSSWYx'; // simulates connected wallet. 


  const navLinks = [
    {
        name: "Apply",
        onClick: () => {}
    },
    {
        name: "Browse",
        onClick: () => {}
    },
    {
        name: "Sell",
        onClick: () => {}
    },
    {
        name: "Community",
        onClick: () => {}
    },
  ]

  return (
    <>
    <nav className="app-navbar">
      <VolumeAndLangBar dailyVolume={props.dailyVolume} totalVolume={props.totalVolume} />
      <div className="main-navbar">
        <div
          onClick={ () => props.setOpenSidebar(true)}
          className={`sidebar-open-btn ${expandSearchBox ? "hide-mobile" : "" }`}
        >
          <IconLoader icon="menu" />
        </div>        
        <Link to="" className="brand-container">
          <img src={require('../../assets/images/desmarketLogo.png')} alt="brand logo" />
          <BodyText bold>Galacticway</BodyText>
        </Link>
        <div className={ `search-bar-container ${expandSearchBox ? 'show' : ''}` }>
          <CollectionSearchBox />
        </div>
        <div
          onClick={ () => setExpandSearchBox(current => !current)}
          className={`search-icon-btn ${!expandSearchBox ? 'search' : 'cancel'}`}
        >
          <IconLoader icon={ !expandSearchBox ? "search" : "cancel"} />
        </div>
        <div
          onClick={ () => setShowMobileNavMenu(true)}
          className={`nav-toggler ${showMobileNavMenu ? "hidden" : ''}`}
        >
            <IconLoader icon="more" />
        </div>
        <ul className="nav-links">
          {
            navLinks.map((link, i) => (
                <li key={link.name}><BodyText>{link.name}</BodyText></li>
            ))
          }
        </ul>
        {
          walletAddress ? (
            <Button
              secondary
              title={`
                ${walletAddress.slice(0, 4)}...${walletAddress.slice(
                  walletAddress.length - 4,
                  walletAddress.length
                )}
              `}
              onClick={() => {}}
            />            
          ) : (
            <Button className='connect-wallet-btn' title='Connect wallet' icon='wallet' onClick={() => {}} />        
          )
        }
      </div>
    </nav>
    <HomeNavMenu
      showMobileNavMenu={showMobileNavMenu}
      links={navLinks}
      setShowMobileNavMenu={setShowMobileNavMenu}
    />
    </>
  )
}

export default AppNavbar;