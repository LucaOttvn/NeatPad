import { Folder, ModalsNames } from "@/utils/interfaces";
import "./componentsStyle.scss";
import { useContext, useRef } from "react";
import { FoldersContext } from "@/contexts/foldersContext";
import { NotesContext } from "@/contexts/notesContext";
import gsap from 'gsap';
import { isMobile, selectedModal, selectedSideMenu } from "@/utils/signals";

interface FolderProps {
  folder: Folder;
  index: number
}

export default function FolderCard(props: FolderProps) {

  const foldersContext = useContext(FoldersContext)
  const notesContext = useContext(NotesContext)

  const timerRef = useRef<any>(null)

  // start the timer to detect long presses
  function handleTouchStart() {
    gsap.to('#folder' + props.index, {
      scale: 0.9,
      duration: 0.2
    })

    // in delete mode there's no action to trigger on long press, so don't handle it
    if (notesContext?.deleteMode.active) return

    timerRef.current = setTimeout(() => {
      foldersContext?.setUpdatingFolder(props.folder.id)
      selectedModal.value = ModalsNames.folderHandler
    }, 500);
  }

  // if the user removes the finger from the screen before the end of the timeout, clear the timer so no card selection animation gets triggered
  function handleTouchEnd() {
    gsap.to('#folder' + props.index, {
      scale: 1,
      duration: 0.2
    })
    clearTimeout(timerRef.current);
  }

  function handleClick() {
    foldersContext?.setSelectedFolder(props.folder.id)
    // only on mobile, close the side menu on folder selection
    if (isMobile.value) selectedSideMenu.value = undefined
  }

  return (
    <div
      id={'folder' + props.index}
      className="folderCard"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      <div className="flex items-start justify-center flex-col">
        <span style={{ color: `var(--${props.folder.color})` }} className="w-full center title ellipsis-multi">
          {props.folder.name.toUpperCase()}
        </span>
        <span style={{ color: `var(--${props.folder.color})` }} className="w-full center">
          {notesContext?.notes.filter((note) => {
            return note.folders.find(el => el == props.folder.id)
          }).length} notes
        </span>
      </div>
    </div>
  );
}
