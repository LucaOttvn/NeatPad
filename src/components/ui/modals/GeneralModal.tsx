import { useContext, useEffect, useRef } from "react";
import "../../componentsStyle.scss";
import { ModalsContext } from "@/contexts/modalsContext";
import { ModalsNames } from "@/utils/interfaces";
import GeneralModalHeader from "./modalsHeaders/GeneralModalHeader";
import NoteEditorModalHeader from "./modalsHeaders/NoteEditorModalHeader";
import { NotesContext } from "@/contexts/notesContext";
import NoteEditor from "./noteEditor/NoteEditor";
import LoginModal from "./LoginModal";
import FolderHandler from "./FolderHandler";

interface GeneralModalProps {
  width?: number;
  height?: number;
}

export default function GeneralModal(props: GeneralModalProps) {
  const modalsContext = useContext(ModalsContext)
  const notesContext = useContext(NotesContext)
  const width = props.width ? props.width + "%" : '';
  const height = props.height + "%";

  const generalModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    generalModalRef.current?.focus();
  }, [notesContext?.selectedNote]);


  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      // this removes the automatic browser's focus on the button when esc is pressed
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (modalsContext?.selectedModal == ModalsNames.newNote || modalsContext?.selectedModal == ModalsNames.updateNote) {
        notesContext?.handleNoteEditorClose()
      }
      modalsContext?.setSelectedModal(undefined)
    }
  }

  return (
    <div
      id={modalsContext?.selectedModal}
      className="generalModalBackdrop"
      onClick={() => {
        modalsContext?.setSelectedModal(undefined)
      }}
    >
      <div
        className="generalModal"
        style={{ width, height }}
        ref={generalModalRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
        // this allows the generalModalRef to automatically focus itself on open, since this condition is necessary to detect the ESC key press
        tabIndex={0}
        onKeyDown={(e) => {
          handleKeyDown(e)
        }}
      >
        {modalsContext?.selectedModal == ModalsNames.folderHandler && <><GeneralModalHeader
          modalId={ModalsNames.folderHandler}
        />
          <FolderHandler /></>}

        {(modalsContext?.selectedModal == ModalsNames.newNote || modalsContext?.selectedModal == ModalsNames.updateNote) && <>
          <NoteEditorModalHeader
            note={notesContext?.notes.find(
              (el) => el.id === notesContext.selectedNote
            )}
            modalId={modalsContext?.selectedModal == ModalsNames.newNote ? ModalsNames.newNote : ModalsNames.updateNote}
          />
          <NoteEditor note={notesContext?.notes.find(
            (el) => el.id === notesContext.selectedNote
          )} /></>}


        {modalsContext?.selectedModal == ModalsNames.login && <>
          <GeneralModalHeader modalId={ModalsNames.login} className="loginModalHeader" />
          <LoginModal />
        </>}
      </div>
    </div>
  );
}
