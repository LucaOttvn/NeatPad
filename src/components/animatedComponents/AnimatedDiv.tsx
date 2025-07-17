import { ReactNode, useEffect } from "react";
import { gsap, Power4 } from "gsap";
import "./animatedStyle.scss";

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  id?: string
  onClick?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onTouchMove?: () => void;
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
      id={props.id || ''}
      className={`animatedDiv ${props.className || ""}`}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
      onTouchStart={() => {
        if (props.onTouchStart) props.onTouchStart()
      }}
      onTouchEnd={() => {
        if (props.onTouchEnd) props.onTouchEnd()
      }}
      onTouchMove={() => {
        if (props.onTouchMove) props.onTouchMove()
      }}
    >
      {props.children}
    </div>
  );
}
