import React, { useState } from 'react';
import Button from '../Button/Button';
import './ToggleButton.scss';

type TButton = {
  title: string;
  onClick: Function;
}
interface ToggleButtonProps {
  buttons: TButton[]
}
const ToggleButton = (props: ToggleButtonProps) => {
  const [selectedIndex, setSelectedIndex] = useState<Number>(0);

  const onButtonClick = (index: number) => {
    setSelectedIndex(index);
    props.buttons[index].onClick();
  }
  return (
    <div className="filter-toggle-button">
      {
        props.buttons.map((button, i) => (
          <Button
            key={i}
            disabled={false}
            className={selectedIndex !== i ? "inactive" : ""}
            title={button.title}
            onClick={() => onButtonClick(i)}
          />
        ))
      }
    </div>
  )
}

export default ToggleButton;