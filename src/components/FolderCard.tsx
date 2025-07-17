import { colors, Folder } from "@/utils/interfaces";
import "./componentsStyle.scss";
import { useContext } from "react";
import { FoldersContext } from "@/contexts/foldersContext";
import { ScreenSizeContext } from "@/contexts/screenSizeContext";
import { handleSideMenu } from "@/utils/globalMethods";

interface FolderProps {
  folder: Folder;
  index: number
}

export default function FolderCard(props: FolderProps) {
  const textColor = colors.find(
    (item) => item.color == props.folder.color
  )?.text || "White"

  const screenSizeContext = useContext(ScreenSizeContext)
  const foldersContext = useContext(FoldersContext)

  return (
    <div
      id={'folder' + props.index}
      className="folderCard"
      onClick={() => {
        foldersContext?.setSelectedFolder(props.folder.id)
        if (screenSizeContext) handleSideMenu(false)
      }}
    >
      <div className="flex items-start justify-center flex-col">
        <span style={{ color: `var(--${props.folder.color})` }} className="w-full center title ellipsis-multi">
          {props.folder.name.toUpperCase()}
        </span>
        <span style={{ color: `var(--${props.folder.color})` }} className="w-full center">
          {props.folder.notes.length} notes
        </span>
      </div>
    </div>
  );
}
