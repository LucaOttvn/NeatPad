import { colors, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { FoldersContext } from "@/contexts/foldersContext";
import { useContext, useEffect, useRef } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { ModalsContext } from "@/contexts/modalsContext";
import gsap from 'gsap';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  const foldersContext = useContext(FoldersContext);
  const notesContext = useContext(NotesContext);
  const modalsContext = useContext(ModalsContext);
  const timerRef = useRef<any>(null);

  const foundParentFolder = foldersContext?.folders.find((el) =>
    props.note.id ? el.notes.includes(props.note.id) : undefined
  );

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


  function handleTouchStart() {

    if (!notesContext?.deleteMode.active) {
      // start the timer to detect long presses
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

  return (
    <AnimatedDiv
      id={'noteCard' + props.note.id}
      className="noteCard"
      // when the user long press but then drags the finger outside of the div don't trigger the long press event
      onTouchMove={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
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
          notesContext?.setSelectedNote(props.note.id);
          modalsContext?.setSelectedModal(ModalsNames.updateNote)
        }



      }}
    >
      <div
        className="cornerRounder1"
        style={{
          background: foundParentFolder?.color
            ? `var(--${foundParentFolder?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder2"
        style={{
          background: foundParentFolder?.color
            ? `var(--${foundParentFolder?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div className="cornerRounder3"></div>
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
    </AnimatedDiv>
  );
}
