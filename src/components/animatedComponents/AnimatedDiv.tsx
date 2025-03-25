import { ReactNode, useEffect } from "react";
import { gsap, Power4 } from "gsap";
import "./animatedStyle.scss";

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedDiv(props: AnimatedDivProps) {
  useEffect(() => {
    gsap.to(".animatedDiv", {
      opacity: 1,
      ease: Power4.easeOut,
      duration: 1,
    });
  }, []);

  return (
    <div
      className={`animatedDiv ${props.className || ""}`}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
    >
      {props.children}
    </div>
  );
}
