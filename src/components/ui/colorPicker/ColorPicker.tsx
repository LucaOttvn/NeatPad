import React from "react";
import AnimatedDiv from "../../animatedComponents/AnimatedDiv";
import { colors } from "@/utils/interfaces";
import './colorPicker.scss';

interface ColorPickerProps {
  setSelectedColor: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedColor: string | undefined
}

export default function ColorPicker(props: ColorPickerProps) {
  return (
    <AnimatedDiv className="colorPicker">
      {colors.map((color, index) => {
        if (color.color != "darkGrey")
          return (
            <div
              key={"color" + index}
              className="colorSelector"
              style={{ background: `var(--${color.color})`, border: props.selectedColor == color.color ? `solid 3px var(--Black)` : '', outline: props.selectedColor == color.color ? `solid 3px var(--White)` : ''}}
              onClick={() => {
                props.setSelectedColor(color.color);
              }}
            ></div>
          );
      })}
    </AnimatedDiv>
  );
}
