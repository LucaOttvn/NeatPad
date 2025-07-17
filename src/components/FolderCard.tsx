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
      style={{ backgroundColor: props.folder.colors.shadow }}
    >
      <div
        className="cornerRounder1"
        style={{ backgroundColor: props.folder.colors.mainColor }}
      ></div>
      <div
        className="cornerRounder2"
        style={{ backgroundColor: props.folder.colors.mainColor }}
      ></div>
      <div
        className="cornerRounder3"
        style={{ backgroundColor: props.folder.colors.shadow }}
      ></div>
      <ReactSVG src="/icons/folder.svg" className="icon" />
      <div className="flex items-start justify-start flex-col">
        <span>{props.folder.name}</span>
        <span className="notesCounter">4 notes</span>
      </div>
    </div>
  );
}
