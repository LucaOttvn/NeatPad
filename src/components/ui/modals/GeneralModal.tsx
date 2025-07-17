import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import "../../componentsStyle.scss";
import { modalsList, ModalsNames } from "@/utils/interfaces";
import GeneralModalHeader from "./modalsHeaders/GeneralModalHeader";
import NoteEditorModalHeader from "./modalsHeaders/NoteEditorModalHeader";
import { NotesContext } from "@/contexts/notesContext";
import NoteEditor from "./noteEditor/NoteEditor";
import LoginModal from "./login/LoginModal";
import FolderHandler from "./folderHandler/FolderHandler";
import { FoldersContext } from "@/contexts/foldersContext";
import SettingsModal from "./settings/SettingsModal";
import { selectedModal } from "@/utils/signals";
import { handleModal } from "@/utils/globalMethods";

export default function GeneralModal() {
  const notesContext = useContext(NotesContext)
  const foldersContext = useContext(FoldersContext)

  const generalModalRef = useRef<HTMLDivElement>(null)

  const modalStyle = modalsList.find(el => el.name == selectedModal.value)


  useEffect(() => {
    // this allows the ESC button to be detected even if the user doesn't click on the modal before
    generalModalRef.current?.focus();
  }, [selectedModal.value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      // this removes the automatic browser's focus on the button when esc is pressed
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      if (selectedModal.value == ModalsNames.newNote || selectedModal.value == ModalsNames.updateNote) {
        notesContext?.handleNoteEditorClose()
      }
      if (selectedModal.value == ModalsNames.folderHandler) { foldersContext?.setUpdatingFolder(undefined) }
      handleModal(undefined)
    }
  }

  function handleBackdropClick() {
    // handle the note saving/deleting when the user clicks on the modals's backdrop to close it
    if (selectedModal.value == ModalsNames.newNote || selectedModal.value == ModalsNames.updateNote) {
      notesContext?.handleNoteEditorClose()
    }
    handleModal(undefined)
  }

  // check README > ## SIDE EFFECTS FOR DOM SIGNALS for details
  useLayoutEffect(() => {
    if (selectedModal.value) handleModal(selectedModal.value)
  }, [selectedModal.value])

  return (
    <div
      id={selectedModal.value}
      className="generalModalBackdrop"
      onClick={() => {
        handleBackdropClick()
      }}
    >
      <div
        className="generalModal"
        ref={generalModalRef}
        onClick={(e) => {
          // avoid the modal closure on modal's body click because of the parent div onclick event trigger
          e.stopPropagation();
        }}
        style={{ width: modalStyle?.width, height: modalStyle?.height, maxWidth: modalStyle?.maxWidth }}
        // this allows the generalModalRef to automatically focus itself on open, since this condition is necessary to detect the ESC key press
        tabIndex={0}
        onKeyDown={(e) => {
          handleKeyDown(e)
        }}
      >
        {/* folder handler */}
        {selectedModal.value == ModalsNames.folderHandler && <><GeneralModalHeader
          modalId={ModalsNames.folderHandler}
        />
          <FolderHandler /></>}

        {/* note editor */}
        {(selectedModal.value == ModalsNames.newNote || selectedModal.value == ModalsNames.updateNote) && <>
          <NoteEditorModalHeader
            note={notesContext?.notes.find(
              (el) => el.id === notesContext.selectedNote
            )}
            modalId={selectedModal.value == ModalsNames.newNote ? ModalsNames.newNote : ModalsNames.updateNote}
          />
          <NoteEditor note={notesContext?.notes.find(
            (el) => el.id === notesContext.selectedNote
          )} /></>}

        {/* login/create account */}
        {(selectedModal.value == ModalsNames.login || selectedModal.value == ModalsNames.createAccount) && <>
          <GeneralModalHeader modalId={ModalsNames.login} className="loginModalHeader" />
          <LoginModal creatingAccount={selectedModal.value == ModalsNames.createAccount} />
        </>}


        {/* settings */}
        {selectedModal.value == ModalsNames.settings && <>
          <GeneralModalHeader modalId={ModalsNames.login} className="loginModalHeader" />
          <SettingsModal />
        </>}
      </div>
    </div>
  );
}
