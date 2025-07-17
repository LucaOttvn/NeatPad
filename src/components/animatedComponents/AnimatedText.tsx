import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
  text: string;
  color?: string | undefined
  className?: string;
  onClick?: () => void;
}

export default function AnimatedText(props: AnimatedTextProps) {
  const text = props.text;
  const chars = text.split("");
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (text) gsap.fromTo(
      refs.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
    );
  }, [text]);

  return (
    <span className={`animatedText ${props.className}`}>
      {chars.length > 0 && chars.map((char, i) => (
        <span
        style={{color: `var(--${props.color || 'White'})`}}
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
