import { useContext, useEffect, useState } from "react";
import SvgButton from "../../SvgButton";
import { Note } from "@/utils/interfaces";
import { gsap, Power4 } from "gsap";
import { FoldersContext } from "@/contexts/foldersContext";
import { NotesContext } from "@/contexts/notesContext";
import './modalHeaders.scss';
import { ModalsContext } from "@/contexts/modalsContext";
import { updateNote } from "@/api/notes";
import { ReactSVG } from "react-svg";

interface BasicComponentProps {
  modalId: string;
  note: Note | undefined;
}
// this is the header of the note editor, it has its own set of methods to handle notes creation/update
export default function NoteEditorModalHeader(props: BasicComponentProps) {
  const foldersContext = useContext(FoldersContext);
  const modalsContext = useContext(ModalsContext);
  const notesContext = useContext(NotesContext);

  const [pinned, setPinned] = useState(props.note ? props.note.pinned : false);
  const [foldersListOpened, setFoldersListOpened] = useState(false);

  // note pinning handling
  useEffect(() => {
    const updatedNote = props.note;
    if (updatedNote) {
      updatedNote.pinned = pinned
      updateNote(updatedNote)
      notesContext?.updateNoteState(updatedNote)
    }
  }, [pinned]);

  // animations handling
  useEffect(() => {
    gsap.to(".addNoteToFolder", {
      height: foldersListOpened ? "auto" : 0,
      marginBottom: foldersListOpened ? '1rem' : 0,
      duration: 0.2,
      ease: Power4.easeOut,
    });
    gsap.to('#foldersListOpener', {
      rotateX: foldersListOpened ? '180deg' : 0,
      scale: foldersListOpened ? 1.2 : 1,
      duration: 0.2,
      ease: Power4.easeOut,
    })
  }, [foldersListOpened]);

  return (
    <header className="noteEditorModalHeader">
      <header className="w-full flex justify-between px-3 pt-5 pb-5">
        <div className="start gap-5">
          <SvgButton
            fileName={pinned ? "pinFill" : "pin"}
            onClick={() => {
              setPinned(!pinned);
            }}
          />
          <SvgButton
            id='foldersListOpener'
            fileName="arrowDown"
            onClick={() => {
              setFoldersListOpened(!foldersListOpened);
            }}
          />
        </div>
        <SvgButton
          fileName="close"
          onClick={() => {
            notesContext?.handleNoteEditorClose()
            modalsContext?.setSelectedModal(undefined)
          }}
        />
      </header>
      {/* collapsable section for folder selection */}
      <section className="addNoteToFolder">
        <span className="font-bold">Add note to folder</span>
        <div className="foldersList">
          {foldersContext?.folders.map((folder, index) => {
            return (
              <div
                key={"folder" + index}
                className="folderCard gap-3"
                onClick={() => {
                  const updatedNote = props.note
                  if (updatedNote) {
                    updatedNote.folder = updatedNote.folder == folder.id ? undefined : folder.id
                    notesContext?.updateNoteState(updatedNote)
                  }
                }}
                style={{ border: `${props.note?.folder == folder.id ? 4 : 2}px solid var(--${folder.color})` }}
              >
                {props.note?.folder == folder.id && <ReactSVG src={`/icons/folder.svg`} className="icon" beforeInjection={(svg) => {
                  svg.setAttribute("fill", `var(--${folder.color})`);
                }} />}
                <span className="font-bold" style={{ color: `var(--${folder.color})` }}>{folder.name}</span>
              </div>
            );
          })}
        </div>
      </section>
    </header>
  );
}
