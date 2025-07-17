import { Folder } from "@/utils/interfaces";
import React from "react";
import { ReactSVG } from "react-svg";
import './componentsStyle.scss'

interface FolderProps {
  folder: Folder;
}

export default function FolderCard(props: FolderProps) {
  return (
    <div className="folderCard">
      <ReactSVG src='/icons/folder.svg' className="icon" />
      <span>{props.folder.name}</span>
    </div>
  );
}
