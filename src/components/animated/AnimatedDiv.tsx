import { ReactNode, useEffect } from "react";
import { gsap, Power4 } from "gsap";
import "../style.scss";

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedDiv({ children, className = "" }: AnimatedDivProps) {
  useEffect(() => {
    gsap.to(".animatedDiv", {
      opacity: 1,
      ease: Power4.easeOut,
      duration: 1
    });
  }, []);

  return <div className={`animatedDiv ${className}`}>{children}</div>;
}
