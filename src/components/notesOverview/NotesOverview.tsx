import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteEditor from "../ui/modals/noteEditor/NoteEditor";
import GeneralModal from "../ui/modals/GeneralModal";
import { useContext } from "react";
import { updateNote } from "@/api/notes";
import NoteEditorModalHeader from "../ui/modals/modalsHeaders/NoteEditorModalHeader";
import AnimatedText from "../animatedComponents/AnimatedText";
import GeneralModalHeader from "../ui/modals/modalsHeaders/GeneralModalHeader";
import FolderCreator from "../ui/modals/FolderCreator";
import { NotesContext } from "@/contexts/notesContext";
import { FoldersContext } from "@/contexts/foldersContext";
import NotesSection from "../ui/NotesSection";

export default function NotesOverview() {
  const notesContext = useContext(NotesContext);
  const foldersContext = useContext(FoldersContext);

  const selectedNoteData = notesContext?.notes.find(
    (n) => n.id === notesContext.selectedNote
  );

  const foundSelectedFolderData = foldersContext?.folders.find(
    (el) => el.id == foldersContext.selectedFolder
  );

  let notesToShow: Note[] = [];
  if (foundSelectedFolderData) {
    notesToShow =
      foundSelectedFolderData?.notes.flatMap(
        (noteId) => notesContext?.notes.find((note) => note.id === noteId) ?? []
      ) || [];
  } else {
    notesToShow = notesContext!.notes;
  }

  function handleNoteOnModalClose(newNote?: Note) {
    if (selectedNoteData) {
      selectedNoteData.last_update = new Date();
      updateNote(selectedNoteData);
    }
    if (newNote) {
      console.log(newNote);
    }
    notesContext?.setSelectedNote(undefined);
  }

  return (
    <div className="notesOverviewContainer">
      {foldersContext?.selectedFolder ? <AnimatedText className="title" text={foundSelectedFolderData?.name!} /> : <div className="flex flex-col items-start">
        <div className="blur"></div>
        <AnimatedText className="title" text="My" />
        <AnimatedText className="title ms-5" text="Notes" />
      </div>}
      {/* pinnedSection */}
      {notesToShow.some((el) => el.pinned) && (
        <NotesSection
          notes={notesToShow.filter((el) => el.pinned)}
          title="Pinned"
        />
      )}

      {/* non-pinned notes section */}
      <NotesSection
        notes={notesToShow.filter((el) => !el.pinned)}
        title="Others"
      />

      <GeneralModal
        id={ModalsNames.updateNote}
        width={80}
        height={80}
        onCloseCallback={() => {
          handleNoteOnModalClose();
        }}
      >
        <NoteEditorModalHeader
          note={notesContext?.notes.find(
            (n) => n.id === notesContext.selectedNote
          )}
          modalId={ModalsNames.updateNote}
          onCloseCallback={() => {
            handleNoteOnModalClose();
          }}
        />
        <NoteEditor />
      </GeneralModal>

      <GeneralModal id={ModalsNames.createFolder} height={50}>
        <GeneralModalHeader
          modalId={ModalsNames.createFolder}
        ></GeneralModalHeader>
        <FolderCreator />
      </GeneralModal>

      <GeneralModal
        id={ModalsNames.newNote}
        width={80}
        height={80}
        onCloseCallback={() => {
          handleNoteOnModalClose();
        }}
      >
        <NoteEditorModalHeader
          note={notesContext?.notes.find(
            (n) => n.id === notesContext.selectedNote
          )}
          modalId={ModalsNames.newNote}
          onCloseCallback={() => {
            handleNoteOnModalClose();
          }}
        />
        <NoteEditor />
      </GeneralModal>
    </div>
  );
}
