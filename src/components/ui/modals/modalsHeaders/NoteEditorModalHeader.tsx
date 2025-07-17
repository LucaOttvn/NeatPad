import { useContext, useEffect, useState } from "react";
import SvgButton from "../../SvgButton";
import { Note } from "@/utils/interfaces";
import { gsap, Power4 } from "gsap";
import { FoldersContext } from "@/contexts/foldersContext";
import { NotesContext } from "@/contexts/notesContext";
import './modalHeaders.scss';
import { ModalsContext } from "@/contexts/modalsContext";

interface BasicComponentProps {
  onCloseCallback?: () => void;
  modalId: string;
  note: Note | undefined;
}

export default function NoteEditorModalHeader(props: BasicComponentProps) {
  const foldersContext = useContext(FoldersContext);
  const modalsContext = useContext(ModalsContext);

  const [pinned, setPinned] = useState(false);
  const [foldersListOpened, setFoldersListOpened] = useState(true);

  const notesContext = useContext(NotesContext);

  useEffect(() => {
    // if (props.note) setPinned(props.note.pinned);
  }, [props.note?.pinned]);

  useEffect(() => {
    // if (props.note) {
    //   const updatedNote = props.note;
    //   updatedNote.pinned = pinned;
    //   notesContext?.setNotes(
    //     notesContext.notes.map((note) =>
    //       note.id === updatedNote.id ? updatedNote : note
    //     )
    //   );
    // }
  }, [pinned]);

  useEffect(() => {
    gsap.to(".addNoteToFolder", {
      height: foldersListOpened ? 0 : "auto",
      duration: 0.2,
      ease: Power4.easeOut,
    });
  }, [foldersListOpened]);

  return (
    <header className="noteEditorModalHeader">
      <div className="w-full flex justify-between px-3 pt-5 pb-3">
        <div className="start gap-5">
          <SvgButton
            fileName={pinned ? "pinFill" : "pin"}
            onClick={() => {
              // setPinned(!pinned);
            }}
          />
          <SvgButton
            fileName="plus"
            onClick={() => {
              setFoldersListOpened(!foldersListOpened);
            }}
          />
        </div>
        <SvgButton
          fileName="close"
          onClick={() => {
            if (props.onCloseCallback) props.onCloseCallback();
            modalsContext?.setSelectedModal(undefined)
          }}
        />
      </div>
      <div className="addNoteToFolder">
        <span className="ps-6 pt-5">Add to a folder</span>
        <div className="foldersList">
          {foldersContext?.folders.map((folder, index) => {
            return (
              <div
                key={"folder" + index}
                className="folderCard"
                onClick={() => { }}
                style={{ border: `2px solid var(--${folder.color})` }}
              >
                {/* <ReactSVG src={`/icons/folder.svg`} className="icon" beforeInjection={(svg) => {
                    svg.setAttribute("fill", `var(--${folder.color})`);
                  }} /> */}
                <span className="font-bold" style={{ color: `var(--${folder.color})` }}>{folder.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
