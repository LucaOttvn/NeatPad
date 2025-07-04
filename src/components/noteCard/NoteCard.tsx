import { colors, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { FoldersContext } from "@/contexts/foldersContext";
import { useContext, useEffect, useRef } from "react";
import { NotesContext } from "@/contexts/notesContext";
import gsap from 'gsap';
import { ReactSVG } from "react-svg";
import { selectedModal } from "@/utils/signals";
import { UserContext } from "@/contexts/userContext";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);
  const notesContext = useContext(NotesContext);
  const timerRef = useRef<any>(null);

  const foundParentFolder = foldersContext?.folders.find((folder) => props.note.folders.find(el => el == folder.id));

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

      // if the user isn't the note's owner
      if (props.note.user != userContext?.user?.id) return alert('Collaborators cannot delete notes. To remove this note from your view, please remove your email from its collaborators list.')
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
    if (props.note.user != userContext?.user?.id) return alert('Collaborators cannot delete notes. To remove this note from your view, please remove your email from its collaborators list.')
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

      {props.note.title && (
        // when the shared icon is visible, adapt the title's width
        <h1 style={{ color: textColor ? `var(--${textColor})` : "auto" }}>
          {props.note.title}
        </h1>
      )}
      
      {!props.note.title && <h1 style={{ color: "var(--Grey)" }}>No title</h1>}

      <div className="start gap-2">
        <div className="folderName">
          <ReactSVG src={`/icons/folder.svg`} className="icon" />
          <span style={{ fontSize: '80%' }} className="font-bold">
            {foundParentFolder ? foundParentFolder.name : 'No folder'}
          </span>
        </div>
        {props.note.collaborators.length > 0 && <ReactSVG src={`/icons/people.svg`} className="icon collaboratorIcon" />}
      </div>

    </AnimatedDiv>
  );
}
