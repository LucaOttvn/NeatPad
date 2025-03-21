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
      style={{ backgroundColor: (props.folder.color ? `var(--dark${props.folder.color})` : 'var(--darkGrey)') }}
    >
      <div
        className="cornerRounder1"
        style={{ backgroundColor: (props.folder.color ? `var(--${props.folder.color})` : 'var(--lightBlack)') }}
      ></div>
      <div
        className="cornerRounder2"
        style={{ backgroundColor: (props.folder.color ? `var(--${props.folder.color})` : 'var(--lightBlack)') }}
      ></div>
      <div
        className="cornerRounder3"
        style={{ backgroundColor: (props.folder.color ? `var(--dark${props.folder.color})` : 'var(--darkGrey)') }}
      ></div>
      <ReactSVG src="/icons/folder.svg" className="icon" />
      <div className="flex items-start justify-start flex-col">
        <span>{props.folder.name}</span>
        <span className="notesCounter">{props.folder.notes.length} notes</span>
      </div>
    </div>
  );
}
