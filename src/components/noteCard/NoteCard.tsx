import { colors, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { useEffect, useRef } from "react";
import gsap from 'gsap';
import { ReactSVG } from "react-svg";
import { folders, notesToDelete, selectedModal, selectedNote, user } from "@/utils/signals";


interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {

  const timerRef = useRef<any>(null);

  const foundParentFolder = folders.value.find((folder) => props.note.folders.find(el => el == folder.id));

  const textColor =
    colors.find((item) => item.color == foundParentFolder?.color)?.text ||
    "White";

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    let noteToDelete = notesToDelete.value.find(noteId => noteId == props.note.id)

    gsap.to('#noteCard' + props.note.id, {
      outline: noteToDelete ? 'solid 4px var(--Red)' : 'none',
      duration: 0.2
    })
  }, [notesToDelete.value]);

  // start the timer to detect long presses
  function handleTouchStart() {

    // if delete mode isn't on already
    if (notesToDelete.value.length > 0) return

    timerRef.current = setTimeout(() => {
      notesToDelete.value = [props.note.id!]
    }, 500);
  }

  // if the user removes the finger from the screen before the end of the timeout, clear the timer so no card selection animation gets triggered
  function handleTouchEnd() {
    clearTimeout(timerRef.current);
  }

  function handleClick() {
    // if the delete mode is off
    if (notesToDelete.value.length == 0) {
      // show the clicked note
      selectedNote.value = props.note.id
      return selectedModal.value = ModalsNames.updateNote
    }

    // if the user isn't the note's owner
    if (props.note.user != user.value!.id) return alert('Collaborators cannot delete notes. To remove this note from your view, please remove your email from its collaborators list.')

    // is the cliked card already selected?
    let isNoteAlreadySelected = notesToDelete.value.some(noteId => noteId == props.note.id)

    // if it's already selected remove it, otherwise add it
    notesToDelete.value = isNoteAlreadySelected ? notesToDelete.value.filter(noteId => noteId != props.note.id!) : [...notesToDelete.value, props.note.id!]
  }

  // handle right click on noteCard
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    if (props.note.user != user.value!.id) return alert('Collaborators cannot delete notes. To remove this note from your view, please remove your email from its collaborators list.')
    // activate the delete mode only if it's not on already
    if (notesToDelete.value.length > 0) return
    notesToDelete.value = [props.note.id!]
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
