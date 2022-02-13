import React from 'react';
import './BodyText.scss';

const BodyText = (props) =>{
  const {light, normal, bold, className} = props;
  
  return(
    <p className = {`
        body-text
        ${light ? 'light' : ""}
        ${normal ? "normal" : ""}
        ${bold ? "bold" : ""}
        ${className || ""}
      `}
    >
      {props.children}
    </p>
  )
}

export default BodyText;