import { colors, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { FoldersContext } from "@/contexts/foldersContext";
import { useContext, useEffect, useRef } from "react";
import { NotesContext } from "@/contexts/notesContext";
import gsap from 'gsap';
import { ReactSVG } from "react-svg";
import { selectedModal } from "@/utils/signals";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  const foldersContext = useContext(FoldersContext);
  const notesContext = useContext(NotesContext);
  const timerRef = useRef<any>(null);

  const foundParentFolder = foldersContext?.folders.find((folder) => folder.id == props.note.folder);

  const textColor =
    colors.find((item) => item.color == foundParentFolder?.color)?.text ||
    "White";

  useEffect(() => {

    return () => {
      clearTimeout(timerRef.current);
    };

  }, []);

  useEffect(() => {
    let noteToDelete = notesContext?.deleteMode.notes.find(noteId => noteId == props.note.id)

    gsap.to('#noteCard' + props.note.id, {
      outline: noteToDelete ? 'solid 4px var(--Red)' : 'none',
      duration: 0.2
    })

    // this is the case described in notesContext.tsx about the deleteMode handling
    if (notesContext?.deleteMode.active && notesContext.deleteMode.notes.length == 0) {
      notesContext.setDeleteMode({ active: false, notes: notesContext.deleteMode.notes })
    }
  }, [notesContext?.deleteMode]);


  // start the timer to detect long presses
  function handleTouchStart() {
    if (!notesContext?.deleteMode.active) {
      timerRef.current = setTimeout(() => {
        let notesToDeleteUpdated: number[] = [...notesContext!.deleteMode.notes, props.note.id!]
        notesContext?.setDeleteMode({ active: true, notes: notesToDeleteUpdated })
      }, 500);
    }
  }

  // if the user removes the finger from the screen before the end of the timeout, clear the timer so no card selection animation gets triggered
  function handleTouchEnd() {
    clearTimeout(timerRef.current);
  }

  function handleClick() {
    // if in delete mode
    if (notesContext!.deleteMode.active) {
      let notesToDeleteUpdated: number[] = []

      // is the cliked card already selected?
      let isNoteAlreadySelected = notesContext?.deleteMode.notes.some(noteId => noteId == props.note.id)

      // if it's already selected remove it, otherwise add it
      notesToDeleteUpdated = isNoteAlreadySelected ? notesContext!.deleteMode.notes.filter(noteId => noteId != props.note.id!) : [...notesContext!.deleteMode.notes, props.note.id!]

      notesContext?.setDeleteMode({ active: true, notes: notesToDeleteUpdated })
    }
    else {
      // show the clicked note
      notesContext?.setSelectedNote(props.note.id);
      selectedModal.value = ModalsNames.updateNote
    }
  }

  // handle right click on noteCard
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    let notesToDeleteUpdated: number[] = [...notesContext!.deleteMode.notes, props.note.id!]
    notesContext?.setDeleteMode({ active: true, notes: notesToDeleteUpdated })
  }

  return (
    <AnimatedDiv
      id={'noteCard' + props.note.id}
      className="noteCard"
      // when the user long press but then drags the finger outside of the div doesn't trigger the long press event
      onTouchMove={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onContextMenu={(e) => { handleContextMenu(e) }}
      style={{
        background: foundParentFolder?.color
          ? `var(--${foundParentFolder?.color})`
          : "var(--darkGrey)",
      }}
    >
      <div className="overflow-hidden">
        {props.note.title ? (
          <h1 style={{ color: textColor ? `var(--${textColor})` : "auto" }}>
            {props.note.title}
          </h1>
        ) : (
          <h1 style={{ color: "var(--Grey)" }}>No title</h1>
        )}
        {props.note.text ? (
          <span style={{ color: textColor ? `var(--${textColor})` : "auto" }}>
            {props.note.text}
          </span>
        ) : (
          <span style={{ color: "var(--Grey)" }}>No text</span>
        )}
      </div>
      {foldersContext?.folders.some((folder) => folder.id == props.note.folder) && <div className="folderName" style={{ background: 'var(--darkGrey)' }}>
        <ReactSVG src={`/icons/folder.svg`} className="icon" />
        <span style={{ fontSize: '80%' }} className="font-bold">
          {foldersContext?.folders.find((folder) => folder.id == props.note.folder)?.name}
        </span>
      </div>}

    </AnimatedDiv>
  );
}
