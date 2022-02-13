import React from 'react';
import BodyText from '../../../../components/BodyText/BodyText';
import Button from '../../../../components/Button/Button';
import CollectionCard from '../../../../components/CollectionCard/CollectionCard';
import SectionPadding from '../../../../components/SectionPadding/SectionPadding';
import { defaultPopularCollections } from '../../../../constants/defaultData';
import './NewSection.scss';

const NewSection = () => {
  return(
    <div className="home-collections-section">
      <SectionPadding>
        <div className="head">
          <BodyText className="section-title-text">New</BodyText>
          <Button title="See All" onClick={ () => {} } secondary/>
        </div>
        <div className="cards-container">
          
        {
            defaultPopularCollections.map((item, i) => (
              <CollectionCard
                id={item.id}
                image={item.image}
                name={item.name}
                description={item.description}
              />  
            ))
          }
        </div>
      </SectionPadding>
    </div>
  )
}

export default NewSection;