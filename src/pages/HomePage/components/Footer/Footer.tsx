import React from 'react';
import { Link } from 'react-router-dom';
import DiscordIcon from '../../../../assets/icons/DiscordIcon';
import InstagramIcon from '../../../../assets/icons/InstagramIcon';
import TelegramIcon from '../../../../assets/icons/TelegramIcon';
import TwitterIcon from '../../../../assets/icons/TwitterIcon';
import BodyText from '../../../../components/BodyText/BodyText';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import './Footer.scss';

const Footer = () => {
  return (
    <footer>
      <SectionPadding>
        <div className="brand">
          <div className="brand-content">
            <img
              src={require('../../../../assets/images/desmarketLogo.png')}
              alt="Brand"
            />
            <BodyText>Galacticway</BodyText>
          </div>
          <p>Galacticway, the first NEAR NFT Marketplace for Collections</p>
          <p>© 2022 Galacticway. All Rights Reserved.</p>
        </div>
        <div className="marketplace">
          <BodyText bold>Marketplace</BodyText>
          <ul>
            <li>
              <Link to={"/collections"}>
                <BodyText>Collections</BodyText>
              </Link>
            </li>
            <li>
              <Link to={"/collections"}>
                <BodyText>All NFTs</BodyText>
              </Link>
            </li>
            <li>
              <Link to={"/"}>
                <BodyText>Explore</BodyText>
              </Link>
            </li>
          </ul>
        </div>
        <div className="company">
          <BodyText bold>Company</BodyText>
          <ul>
            <li>
              <a href="https://privacy.galacticway.io" target="_blank">
                <BodyText>Privacy Policy</BodyText>
              </a>
            </li>
            <li><BodyText>Terms of Service</BodyText></li>
            <li><BodyText>Copyright</BodyText></li>
            <li>
              <a href="https://galacticway.freshteam.com/jobs" target="_blank">
                <BodyText>Careers</BodyText>
              </a>
            </li>
          </ul>
        </div>
        <div className="community">
          <BodyText bold>Community</BodyText>
          <ul>
            <li>
              <a href="https://twitter.com/GalacticwayNFT" target="_blank" rel="noreferrer" >
                <BodyText>Twitter</BodyText>
              </a>
            </li>
            <li>
              <a href="https://discord.com/invite/yuBjY6QdR6" target="_blank" rel="noreferrer" >
                <BodyText>Discord</BodyText>
              </a>
            </li>
            <li>
              <a href="https://help.galacticway.io" target="_blank" rel="noreferrer" >
                <BodyText>Help Desk</BodyText>
              </a>
            </li>
            <li>
              <a href="https://galacticway.medium.com" target="_blank" rel="noreferrer" >
                <BodyText>Blog</BodyText>
              </a>
            </li>
          </ul>
        </div>
      </SectionPadding>
    </footer>
  )
}

export default Footer;