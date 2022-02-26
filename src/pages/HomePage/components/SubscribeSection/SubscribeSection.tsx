import React from 'react';
import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import './SubscribeSection.scss';

const SubscribeSection = () => {
  return (
    <div className="subscribe-section">
      <SectionPadding>
        <div className="content">
          <div className="details">
            <BodyText>DISCOVER NFT</BodyText>
            <BodyText>Never miss a drop!</BodyText>
            <BodyText>
              Subctibe to our ultra-exclusive drop list and be the first to know about
              upcoming NFT drops
            </BodyText>
            <div className="subscribe-form">
              <input type="text" placeholder='Email address' />
              <Button title='Subscribe' onClick={() => { }} disabled={false} />
            </div>
          </div>
        </div>
        <div className="bg-img-container">
          <img
            src={require('../../../../assets/images/subscribeSectionBg.png')}
            alt="subscribe section background"
          />
          <div className='darkener' />
        </div>
      </SectionPadding>

    </div>
  )
}

export default SubscribeSection;