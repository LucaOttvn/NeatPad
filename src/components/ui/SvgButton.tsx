import { ReactSVG } from "react-svg";

interface SvgButtonProps {
  fileName: string;
  onClick: () => void;
}

export default function SvgButton(props: SvgButtonProps) {
  return (
    <button
      className="iconBtn"
      onClick={() => {
        props.onClick();
      }}
    >
      <ReactSVG src={`/icons/${props.fileName}.svg`} className="icon" />
    </button>
  );
}
