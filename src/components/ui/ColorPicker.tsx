import React from "react";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { colors } from "@/utils/interfaces";

interface ColorPickerProps {
  setSelectedColor: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function ColorPicker(props: ColorPickerProps) {
  return (
    <AnimatedDiv className="colorPicker">
      {colors.map((color, index) => {
        if (color.color != "lightBlack")
          return (
            <div
              key={"color" + index}
              className="colorSelector"
              style={{ background: `var(--${color.color})` }}
              onClick={() => {
                props.setSelectedColor(color.color);
              }}
            ></div>
          );
      })}
    </AnimatedDiv>
  );
}
