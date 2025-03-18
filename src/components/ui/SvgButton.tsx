import { ReactSVG } from "react-svg";

interface SvgButtonProps {
  fileName: string;
  callback: () => void;
}

export default function SvgButton(props: SvgButtonProps) {
  return (
    <button
      className="iconBtn"
      onClick={() => {
        props.callback();
      }}
    >
      <ReactSVG src={`/icons/${props.fileName}.svg`} className="icon" />
    </button>
  );
}
