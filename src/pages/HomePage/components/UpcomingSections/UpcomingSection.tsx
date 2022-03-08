import React from 'react';
import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import ImageWithLoadBgHome from '../../../../components/ImageWithLoadBg/ImageWithLoadBgHome';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import './UpcomingSection.scss';

type TUpcomingLaunches = {
  image: any;
  date: string;
  name: string;
  link: string;
}

const defaultUpcomingLaunches: TUpcomingLaunches[] = [
  {
    image: require('../../../../assets/images/defaultUpcomingLaunch1.png'),
    date: "25 Dec 2022",
    name: "Fury Club for Metaverse",
    link: "https://www.facebook.com",
  },
  {
    image: require('../../../../assets/images/defaultUpcomingLaunch2.png'),
    date: "25 Dec 2022",
    name: "Futurstic Game",
    link: "https://www.facebook.com",
  },
  {
    image: require('../../../../assets/images/defaultUpcomingLaunch3.png'),
    date: "25 Dec 2022",
    name: "Virtual Reality",
    link: "https://www.facebook.com",
  },

]

const UpcomingSection = () => {
  return (
    <div className="home-upcoming-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">Upcoming Launches</BodyText>
          <Button title="See all" secondary onClick={() => { }} disabled={false} />
        </div>
        <div className="cards-container">
          {
            defaultUpcomingLaunches.map((launch, i) => (
              <a href={launch.link} target="_blank" rel="noreferrer" className="upcoming-launch-card" key={i}>
                <ImageWithLoadBgHome aspectRatio={0.9375} src={launch.image} alt={launch.name} />
                <div className="img-darkener" />
                <div className="details">
                  <BodyText bold className="name">{launch.name}</BodyText>
                  <BodyText light className="date">{launch.date}</BodyText>
                </div>
              </a>
            ))
          }
        </div>
      </SectionPadding>
    </div>
  )
}

export default UpcomingSection;