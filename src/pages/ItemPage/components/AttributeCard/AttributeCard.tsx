import React from 'react';
import CopyIcon from '../../../../assets/icons/CopyIcon';
import BodyText from '../../../../components/BodyText/BodyText';
import copy from 'copy-to-clipboard'
import './AttributeCard.scss';

const AttributeCard = (props: any) => {
  const { name, value } = props;
  return (
    <div className="attribute-card">
      <BodyText className="name" light>{name.toUpperCase()}</BodyText>
      <BodyText className="value" bold>{value}</BodyText>
      {/* <div className="copy-btn" onClick={() => copy(value)}>
        <CopyIcon />
      </div> */}
    </div>
  )
}

export default AttributeCard;