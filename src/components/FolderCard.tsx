import { colors, Folder } from "@/utils/interfaces";
import { ReactSVG } from "react-svg";
import "./componentsStyle.scss";
import { useContext, useEffect, useState } from "react";
import { FoldersContext } from "@/contexts/foldersContext";
import { handleSideMenu } from "@/utils/globalMethods";
import { ScreenSizeContext } from "@/contexts/screenSizeContext";
interface FolderProps {
  folder: Folder;
}

export default function FolderCard(props: FolderProps) {

  const textColor = colors.find(
    (item) => item.color == props.folder.color
  )?.text || "White"

  const screenSizeContext = useContext(ScreenSizeContext)
  const foldersContext = useContext(FoldersContext)

  return (
    <div
      className="folderCard"
      onClick={()=>{
        foldersContext?.setSelectedFolder(props.folder.id)
        if (screenSizeContext) handleSideMenu(false)
      }}
      style={{
        backgroundColor: props.folder.color
          ? `var(--dark${props.folder.color})`
          : "var(--darkGrey)",
      }}
    >
      <div
        className="cornerRounder1"
        style={{
          backgroundColor: props.folder.color
            ? `var(--${props.folder.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder2"
        style={{
          backgroundColor: props.folder.color
            ? `var(--${props.folder.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder3"
        style={{
          backgroundColor: props.folder.color
            ? `var(--dark${props.folder.color})`
            : "var(--darkGrey)",
        }}
      ></div>
      <ReactSVG
        src="/icons/folder.svg"
        className="icon"
        beforeInjection={(svg) => {
          if (textColor) svg.setAttribute("fill", `var(--${textColor})`);
        }}
      />
      <div className="flex items-start justify-start flex-col">
        <span style={{ color: `var(--${textColor})` }}>
          {props.folder.name}
        </span>
        <span style={{ color: `var(--${textColor})` }} className="notesCounter">
          {props.folder.notes.length} notes
        </span>
      </div>
    </div>
  );
}
