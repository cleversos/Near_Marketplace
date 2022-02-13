import React from 'react';
import CopyIcon from '../../../../assets/icons/CopyIcon';
import BodyText from '../../../../components/BodyText/BodyText';
import './AttributeCard.scss';

interface Attribute {
  name: string;
  value: string;
}

const AttributeCard = (props: Attribute) => {
  return(
    <div className="attribute-card">
      <BodyText className="name" light>{props.name.toUpperCase()}</BodyText>
      <BodyText className="value" bold>{props.value}</BodyText>
      <div className="copy-btn">
        <CopyIcon />
      </div>
    </div>
  )
}

export default AttributeCard;