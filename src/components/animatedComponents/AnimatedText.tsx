import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedText(props: AnimatedTextProps) {
  const text = props.text;
  const chars = text.split("");
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(
      refs.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
    );
  }, []);

  return (
    <span className={`animatedText ${props.className}`}>
      {chars.map((char, i) => (
        <span
          className="animatedChar"
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
