import React from "react";
import BodyText from "../BodyText/BodyText";
import "./choice-renderer.scss";

type TComponent = {
  title: string;
  component: React.ReactNode;
};

interface ChoiceRendererProps {
  components: TComponent[];
  selected: number;
  changeHandler: (index: number) => void;
}

const ChoiceRenderer = (props: ChoiceRendererProps) => {
  return (
    <div className="choice-renderer">
      <div className="choice-renderer-header">
        {props.components.map((item: TComponent, index: number) => {
          return (
            <div
              key={item.title}
              onClick={() => props.changeHandler(index)}
              className={`choice-renderer-option ${
                index === props.selected ? "choice-renderer-selected" : ""
              } `}
            >
              <BodyText>{item.title}</BodyText>
            </div>
          );
        })}
      </div>
      <div className="choice-renderer-body">
        {props.components[props.selected].component}
      </div>
    </div>
  );
};

export default ChoiceRenderer;
