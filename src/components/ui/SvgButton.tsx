import { ReactSVG } from "react-svg";

interface SvgButtonProps {
  id?: string
  fileName: string;
  className?: string
  onClick: () => void;
}

export default function SvgButton(props: SvgButtonProps) {
  return (
    <button
      id={props.id}
      className={`iconBtn ${props.className}`}
      onClick={() => {
        props.onClick();
      }}
    >
      <ReactSVG src={`/icons/${props.fileName}.svg`} className="icon" />
    </button>
  );
}
