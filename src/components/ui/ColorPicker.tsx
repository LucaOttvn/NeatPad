import React from "react";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { colors } from "@/utils/interfaces";

interface ColorPickerProps {
  setSelectedColor: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function ColorPicker(props: ColorPickerProps) {
 
  return (
    <AnimatedDiv className="start gap-5">
      {colors.map((color, index) => (
        <div
          key={"color" + index}
          className="colorSelector"
          style={{ background: `var(--${color})` }}
          onClick={()=>{
            props.setSelectedColor(color)
          }}
        ></div>
      ))}
    </AnimatedDiv>
  );
}
