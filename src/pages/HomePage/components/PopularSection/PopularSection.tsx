import React from 'react';
import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import CollectionCard from '../../../../components/CollectionCard/CollectionCard';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import { defaultPopularCollections } from '../../../../constants/defaultData';
import './PopularSection.scss';



const PopularSection = () => {
  return(
    <div className="popular-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">Popular</BodyText>
          <Button title="See All" onClick={ () => {} } secondary/>
        </div>
        <div className="cards-container">
          {
            defaultPopularCollections.map((item, i) => (
              <CollectionCard
                id={item.id}
                image={item.image}
                volTraded={item.volTraded}
                name={item.name}
              />  
            ))
          }
        </div>
      </SectionPadding>
    </div>
  )
}

export default PopularSection;