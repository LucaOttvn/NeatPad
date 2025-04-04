import { colors, Folder } from "@/utils/interfaces";
import "./componentsStyle.scss";
import { useContext } from "react";
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
      onClick={() => {
        foldersContext?.setSelectedFolder(props.folder.id)
        if (screenSizeContext) handleSideMenu(false)
      }}
    >
      <div className="flex items-start justify-start flex-col">
        <span style={{color: `var(--${props.folder.color})`}} className="title ellipsis-multi">
          {props.folder.name.toUpperCase()}
        </span>
        <span style={{color: `var(--${props.folder.color})`}} className="notesCounter">
          {props.folder.notes.length} notes
        </span>
      </div>
    </div>
  );
}
