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
import { ModalsContext } from "@/contexts/modalsContext";

export default function NotesOverview() {
  const notesContext = useContext(NotesContext);
  const modalsContext = useContext(ModalsContext);
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

  function handleNoteOnModalClose() {
    // if there's a selected note
    if (selectedNoteData) {
      selectedNoteData.last_update = new Date();
      updateNote(selectedNoteData);
    }
    else {
      // const note: Note = {
      //   title: 'New',
      //   text: 'New',
      //   state: 0,
      //   user: userId,
      //   last_update: new Date(),
      //   pinned: false
      // }
      // createNote()
    }
    notesContext?.setSelectedNote(undefined);
  }

  return (
    <div className="notesOverviewContainer">

      {foldersContext?.selectedFolder ? <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase()!} color={foundSelectedFolderData?.color} /> : <div className="flex flex-col items-start">
        <div className="blur"></div>
        <AnimatedText className="title" text="My" />
        <AnimatedText className="title ms-5" text="Notes" />
      </div>}
      {/* pinnedSection (show it only if there's at least one pinned note) */}
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

      <GeneralModal></GeneralModal>
    </div>
  );
}
