import { useContext, useEffect } from "react";
import "../../componentsStyle.scss";
import { ModalsContext } from "@/contexts/modalsContext";
import { ModalsNames } from "@/utils/interfaces";
import GeneralModalHeader from "./modalsHeaders/GeneralModalHeader";
import FolderCreator from "./FolderCreator";
import NoteEditorModalHeader from "./modalsHeaders/NoteEditorModalHeader";
import { NotesContext } from "@/contexts/notesContext";
import NoteEditor from "./noteEditor/NoteEditor";
import LoginModal from "./LoginModal";

interface GeneralModalProps {
  width?: number;
  height?: number;
  onCloseCallback?: () => void;
}

export default function GeneralModal(props: GeneralModalProps) {
  const modalsContext = useContext(ModalsContext)
  const notesContext = useContext(NotesContext)
  const width = props.width ? props.width + "%" : '';
  const height = props.height + "%";

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      // this removes the automatic browser's focus on the button when esc is pressed
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (props.onCloseCallback) props.onCloseCallback();
      modalsContext?.setSelectedModal(undefined)
    }
  }

  return (
    <div
      id={modalsContext?.selectedModal}
      className="generalModalBackdrop"
      onClick={() => {
        if (props.onCloseCallback) props.onCloseCallback();
        modalsContext?.setSelectedModal(undefined)

      }}
    >
      <div
        className="generalModal"
        style={{ width, height }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {modalsContext?.selectedModal == ModalsNames.createFolder && <><GeneralModalHeader
          modalId={ModalsNames.createFolder}
        ></GeneralModalHeader>
          <FolderCreator /></>}

        {(modalsContext?.selectedModal == ModalsNames.newNote || modalsContext?.selectedModal == ModalsNames.updateNote) && <>
          <NoteEditorModalHeader
            note={notesContext?.notes.find(
              (n) => n.id === notesContext.selectedNote
            )}
            modalId={modalsContext?.selectedModal == ModalsNames.newNote ? ModalsNames.newNote : ModalsNames.updateNote}
            onCloseCallback={() => {
              // handleNoteOnModalClose();
            }}
          />
          <NoteEditor /></>}


        {modalsContext?.selectedModal == ModalsNames.login && <>
          <GeneralModalHeader modalId={ModalsNames.login} className="loginModalHeader"/>
          <LoginModal/>
          </>}
      </div>
    </div>
  );
}
