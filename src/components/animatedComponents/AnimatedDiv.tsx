import { CSSProperties, ReactNode } from "react";
import "./animatedStyle.scss";

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  id?: string
  style?: CSSProperties
  onClick?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onTouchMove?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export default function AnimatedDiv(props: AnimatedDivProps) {
  
  return (
    <div
      id={props.id || ''}
      className={`animatedDiv ${props.className || ""}`}
      style={props.style}
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
      onContextMenu={(e) => {
        if (props.onContextMenu) props.onContextMenu(e)
      }}
    >
      {props.children}
    </div>
  );
}
