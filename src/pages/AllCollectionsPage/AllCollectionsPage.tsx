import React from 'react';
import BodyText from '../../components/BodyText/BodyText';
import CollectionCard from '../../components/CollectionCard/CollectionCard';
import { defaultPopularCollections } from '../../constants/defaultData';
import './AllCollectionsPage.scss';

const AllCollectionsPage = () => {
  return(
    <div className="all-collections-page">
      <BodyText bold className="page-title">All Collections</BodyText>
      <div className="collections-container">
        {
          [...defaultPopularCollections, ...defaultPopularCollections, ...defaultPopularCollections].map((collection, i) => (
            <CollectionCard
              image={collection.image}
              name={collection.name}
              id={collection.name}
              volTraded={collection.volTraded}
              description={collection.description}
            />
          ))
        }
      </div>
    </div>
  )
}

export default AllCollectionsPage;