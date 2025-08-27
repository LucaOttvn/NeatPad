import { Folder, ModalsNames, Note } from "@/utils/interfaces";
import "./componentsStyle.scss";
import { useEffect, useRef, useState } from "react";
import gsap from 'gsap';
import {
  isMobile,
  notesToDelete,
  notesToShow,
  selectedFolder,
  selectedModal,
  selectedSideMenu,
  updatingFolder,
} from "@/utils/signals";
import { db } from "@/utils/db";

interface FolderProps {
  folder: Folder;
  index: number
}

export default function FolderCard(props: FolderProps) {

  // this state is necessary for the notes counter under the card name, it can't be based upon the notesToShow array since that doesn't necessarily contains all the notes
  const [localNotes, setLocalNotes] = useState<Note[] | undefined>()

  useEffect(() => {
    (async () => {
      setLocalNotes(await db.notes.toArray())
    })()
  }, []);

  const timerRef = useRef<any>(null)

  // start the timer to detect long presses
  function handleTouchStart() {
    gsap.to('#folder' + props.index, {
      scale: 0.9,
      duration: 0.2
    })

    // in delete mode there's no action to trigger on long press, so don't handle it
    if (notesToDelete.value.length > 0) return

    timerRef.current = setTimeout(() => {
      updatingFolder.value = props.folder.id
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
    selectedFolder.value = props.folder.id
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
          {localNotes && localNotes.filter((note) => {
            return note.folders.find(el => el == props.folder.id)
          }).length} notes
        </span>
      </div>
    </div>
  );
}