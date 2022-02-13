import React from 'react';
import DiscordIcon from '../../../../assets/icons/DiscordIcon';
import InstagramIcon from '../../../../assets/icons/InstagramIcon';
import TelegramIcon from '../../../../assets/icons/TelegramIcon';
import TwitterIcon from '../../../../assets/icons/TwitterIcon';
import BodyText from '../../../../components/BodyText/BodyText';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import './Footer.scss';

const Footer = () => {
  return(
    <footer>
      <SectionPadding>
        <div className="brand">
          <img
            src={require('../../../../assets/images/desmarketLogo.png')}
            alt="Brand"
          />
          <BodyText>Galacticway</BodyText>
        </div>
        <div className="links">
          <BodyText bold>Links</BodyText>
          <ul>
            <li><BodyText>Collections</BodyText></li>
            <li><BodyText>Launchpad</BodyText></li>
            <li><BodyText>FAQs</BodyText></li>
            <li><BodyText>Sell/Your Wallet</BodyText></li>
          </ul>
        </div>
        <div className="top-collections">
          <BodyText bold>Top Collections</BodyText>
          <ul>
            <li><BodyText>Soi Squiggle</BodyText></li>
            <li><BodyText>TrashyPandas</BodyText></li>
            <li><BodyText>Psychobats</BodyText></li>
            <li><BodyText>Kolsana</BodyText></li>
            <li><BodyText>Mighty Pangolins NFT</BodyText></li>
            <li><BodyText>Block Buddies</BodyText></li>
          </ul>
        </div>
        <div className="community">
          <BodyText bold>Join The Community</BodyText>
          <div className="socials">
            <DiscordIcon />
            <TelegramIcon />
            <TwitterIcon />
            <InstagramIcon />
          </div>
        </div>
      </SectionPadding>
    </footer>
  )
}

export default Footer;