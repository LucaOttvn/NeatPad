import { CSSProperties } from "react";
import { ReactSVG } from "react-svg";

interface SvgButtonProps {
  id?: string
  fileName: string;
  className?: string
  style?: CSSProperties
  onClick: () => void;
  color?: string
}

export default function SvgButton(props: SvgButtonProps) {
  return (
    <button
      id={props.id}
      className={`iconBtn ${props.className || ''}`}
      style={props.style}
      onClick={() => {
        props.onClick();
      }}
    >
      <ReactSVG src={`/icons/${props.fileName}.svg`} className="icon" beforeInjection={(svg) => {
        svg.setAttribute("fill", props.color ? `var(--${props.color})` : 'var(--White)');
      }} />
    </button>
  );
}
