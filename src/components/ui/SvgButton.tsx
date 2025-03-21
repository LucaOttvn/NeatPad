import { ReactSVG } from "react-svg";

interface SvgButtonProps {
  fileName: string;
  className?: string
  onClick: () => void;
}

export default function SvgButton(props: SvgButtonProps) {
  return (
    <button
      className={`iconBtn ${props.className}`}
      onClick={() => {
        props.onClick();
      }}
    >
      <ReactSVG src={`/icons/${props.fileName}.svg`} className="icon"/>
    </button>
  );
}
