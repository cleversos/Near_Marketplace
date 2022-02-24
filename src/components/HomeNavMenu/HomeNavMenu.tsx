import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import { IconLoader } from '../IconLoader';
import './HomeNavMenu.scss';

type TLink = {
  name: string;
  link: string;
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
            <Link to={link.link} key={i} style={{ color: "#b3b9c4" }}>{link.name}</Link>
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