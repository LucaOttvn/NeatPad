import React, { ReactNode, useEffect } from "react";
import { gsap, Power4 } from "gsap";
import "../style.scss";

interface AnimatedDivProps {
  children: ReactNode;
}

export default function AnimatedDiv(props: AnimatedDivProps) {
  useEffect(() => {
    gsap.to(".animatedDiv", {
      scale: 1,
      ease: Power4.easeOut,
    });
  }, []);
  return <div className="animatedDiv">{props.children}</div>;
}
