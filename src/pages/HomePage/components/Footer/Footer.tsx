import React from 'react';
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
            <li><BodyText>Collections</BodyText></li>
            <li><BodyText>All NFTs</BodyText></li>
            <li><BodyText>Explore</BodyText></li>
          </ul>
        </div>
        <div className="company">
          <BodyText bold>Company</BodyText>
          <ul>
            <li><BodyText>Privacy Policy</BodyText></li>
            <li><BodyText>Terms of Service</BodyText></li>
            <li><BodyText>Copyright</BodyText></li>
            <li><BodyText>Careers</BodyText></li>
          </ul>
        </div>
        <div className="community">
          <BodyText bold>Community</BodyText>
          <ul>
            <li><BodyText>Twitter</BodyText></li>
            <li><BodyText>Discord</BodyText></li>
            <li><BodyText>Help Desk</BodyText></li>
            <li><BodyText>Blog</BodyText></li>
          </ul>
        </div>
      </SectionPadding>
    </footer>
  )
}

export default Footer;