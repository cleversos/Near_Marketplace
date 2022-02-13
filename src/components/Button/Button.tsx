import React from 'react';
import BodyText from '../BodyText/BodyText';
import { IconLoader } from '../IconLoader';
import './Button.scss';

interface ButtonProps {
  title: string;
  onClick: Function;
  className?: string;
  secondary?: boolean;
  icon?: string;
}

const Button = (props: ButtonProps) =>{
  const {title, onClick, className, secondary, icon} = props;
  
  return(
      <button
        onClick = {() => onClick()}
        className = {`main-button${secondary ? " secondary" : ""} ${className || ""}`}
      >
        {
          icon && 
          <IconLoader icon={icon} />
        }
        <BodyText light = {secondary ? true : false}>{title}</BodyText>
      </button>
    )
}

export default Button;