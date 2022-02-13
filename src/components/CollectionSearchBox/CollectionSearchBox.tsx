import React from 'react';
import { IconLoader } from '../IconLoader';
import './CollectionSearchBox.scss';

const CollectionSearchBox = () => {
  const onSearchInputChange = () => {
    
  }
  return(
    <div className="collection-search-box">
        <IconLoader icon='search'/>
        <input type="text" placeholder="Search" onChange={onSearchInputChange} />
    </div>
  )
}

export default CollectionSearchBox;