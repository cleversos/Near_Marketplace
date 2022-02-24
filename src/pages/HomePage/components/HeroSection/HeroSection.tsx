import React from 'react';
import { Carousel, CarouselItem } from 'react-bootstrap';
import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import './HeroSection.scss';

type TFeaturedPost = {
  imageUrl: any;
  caption: string;
}

const featuredPost: TFeaturedPost[] = [
  {
    imageUrl: require("../../../../assets/images/heroBg.jpg"),
    caption: "Discover, Collect & sell Various Nfts"
  },
  {
    imageUrl: require("../../../../assets/images/heroBg.jpg"),
    caption: "Discover, Collect & sell Various Nfts"
  },
  {
    imageUrl: require("../../../../assets/images/heroBg.jpg"),
    caption: "Discover, Collect & sell Various Nfts"
  },
]

const HeroSection = () => {
  return (
    <Carousel controls={false}>
      {
        featuredPost.map((post, i) => (
          <CarouselItem key={i}>
            <div className="hero-section">
              <SectionPadding>
                <div className="content">
                  <BodyText className="hero-text">{post.caption}</BodyText>
                  <Button title="Explore more" onClick={() => { }} />
                </div>
              </SectionPadding>
              <div className="bg-darkener" />
              <div className="bg-img-container">
                <img
                  src={post.imageUrl}
                  alt="hero background"
                />
              </div>
            </div>
          </CarouselItem>
        ))
      }
    </Carousel>
  )
}

export default HeroSection;