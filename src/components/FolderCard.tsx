import { Folder } from "@/utils/interfaces";
import { ReactSVG } from "react-svg";
import "./componentsStyle.scss";

interface FolderProps {
  folder: Folder;
}

export default function FolderCard(props: FolderProps) {
  return (
    <div
      className="folderCard"
      style={{ backgroundColor: `var(--dark${props.folder.color})` }}
    >
      <div
        className="cornerRounder1"
        style={{ backgroundColor: `var(--${props.folder.color})` }}
      ></div>
      <div
        className="cornerRounder2"
        style={{ backgroundColor: `var(--${props.folder.color})` }}
      ></div>
      <div
        className="cornerRounder3"
        style={{ backgroundColor: `var(--dark${props.folder.color})` }}
      ></div>
      <ReactSVG src="/icons/folder.svg" className="icon" />
      <div className="flex items-start justify-start flex-col">
        <span>{props.folder.name}</span>
        <span className="notesCounter">4 notes</span>
      </div>
    </div>
  );
}
