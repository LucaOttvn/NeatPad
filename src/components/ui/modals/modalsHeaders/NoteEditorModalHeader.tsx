import { useContext, useEffect, useState } from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";
import { Note } from "@/utils/interfaces";
import { gsap, Power4 } from "gsap";
import { FolderContext } from "@/contexts/foldersContext";
import { ReactSVG } from "react-svg";
import { NotesContext } from "@/contexts/notesContext";

interface BasicComponentProps {
  onCloseCallback?: () => void;
  modalId: string;
  note: Note | undefined;
}

export default function NoteEditorModalHeader(props: BasicComponentProps) {
  const foldersContext = useContext(FolderContext);
  const [pinned, setPinned] = useState(false);
  const [foldersListOpened, setFoldersListOpened] = useState(true);

  const notesContext = useContext(NotesContext);

  useEffect(() => {
    if (props.note) setPinned(props.note.pinned);
  }, [props.note?.pinned]);

  useEffect(() => {
    if (props.note) {
      const updatedNote = props.note;
      updatedNote.pinned = pinned;
      notesContext?.setNotes(
        notesContext.notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    }
  }, [pinned]);

  useEffect(() => {
    gsap.to(".addNoteToFolder", {
      height: foldersListOpened ? 0 : "100%",
      duration: 0.2,
      ease: Power4.easeOut,
    });
  }, [foldersListOpened]);

  return (
    <header className="flex start flex-col">
      <div className="modalHeader">
        <div className="start gap-5">
          <SvgButton
            fileName={pinned ? "pinFill" : "pin"}
            onClick={() => {
              setPinned(!pinned);
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
            handleModal(false, props.modalId);
          }}
        />
      </div>
      <div className="addNoteToFolder">
        <div className="w-full start flex-wrap gap-5 p-5">
          {foldersContext?.folders.map((folder, index) => {
            return (
              <div
                key={"folder" + index}
                className="start gap-1"
                onClick={() => {}}
              >
                <ReactSVG src={`/icons/folder.svg`} className="icon" />
                <span>{folder.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
