import React from 'react';
import Button from '../Button/Button';
import { IconLoader } from '../IconLoader';
import './HomeNavMenu.scss';

type TLink = {
  name: string;
  onClick: () => void;
}

interface HomeNavMenuProps {
  links: TLink[];
  showMobileNavMenu: boolean;
  setShowMobileNavMenu: Function;
}

const HomeNavMenu = (props: HomeNavMenuProps) => {
  return (
    <div className={
      `home-nav-menu ${props.showMobileNavMenu ? "show" : ""}`
    }>
      <div className="close-btn-container">
        <div onClick={() => props.setShowMobileNavMenu(false)} className="close-btn">
          <IconLoader icon="cancel" />
        </div>
      </div>
      <ul className="menu-links">
        {
          props.links.map((link, i) => (
            <li onClick={link.onClick} key={i}>{link.name}</li>
          ))
        }
      </ul>
      <div className="wallet-btn-container">
        <Button icon="wallet" title="Connect wallet" onClick={() => { }} />
      </div>
    </div>
  )
}

export default HomeNavMenu;