import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteCard from "../noteCard/NoteCard";
import NoteEditor from "../ui/modals/noteEditor/NoteEditor";
import GeneralModal from "../ui/modals/GeneralModal";
import { useContext, useEffect, useState } from "react";
import { getNotes, updateNote } from "@/api/notes";
import NoteEditorModalHeader from "../ui/modals/modalsHeaders/NoteEditorModalHeader";
import AnimatedText from "../animatedComponents/AnimatedText";
import GeneralModalHeader from "../ui/modals/modalsHeaders/GeneralModalHeader";
import FolderCreator from "../ui/modals/FolderCreator";
import { NotesContext } from "@/contexts/notesContext";

export default function NotesOverview() {
  const [selectedNote, setSelectedNote] = useState<number | undefined>(
    undefined
  );

  const notesContext = useContext(NotesContext);

  useEffect(() => {
    (async () => {
      const fetchedNotes = await getNotes();
      if (fetchedNotes) {
        notesContext?.setNotes(fetchedNotes);
        notesContext?.setNotesToShow(fetchedNotes);
      }
    })();
  }, []);


  function updateNoteOnModalClose() {
    const selectedNoteData = notesContext?.notes.find(
      (n) => n.id === selectedNote
    );
    if (selectedNoteData) {
      selectedNoteData.last_update = new Date();
      updateNote(
        selectedNoteData.id!,
        selectedNoteData.title,
        selectedNoteData.text,
        selectedNoteData.last_update,
        selectedNoteData.pinned
      );
    }
    setSelectedNote(undefined);
  }

  return (
    <div className="notesOverviewContainer">
      <GeneralModal
        id={ModalsNames.updateNote}
        width={80}
        height={80}
        onCloseCallback={() => {
          updateNoteOnModalClose();
        }}
      >
        <NoteEditorModalHeader
          note={notesContext?.notes.find((n) => n.id === selectedNote)}
          modalId={ModalsNames.updateNote}
          onCloseCallback={() => {
            updateNoteOnModalClose();
          }}
        />
        <NoteEditor
          note={notesContext?.notes.find((n) => n.id === selectedNote)}
        />
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
          updateNoteOnModalClose();
        }}
      >
        <NoteEditorModalHeader
          note={notesContext?.notes.find((n) => n.id === selectedNote)}
          modalId={ModalsNames.newNote}
          onCloseCallback={() => {
            updateNoteOnModalClose();
          }}
        />
        <NoteEditor note={undefined} />
      </GeneralModal>

      {/* pinnedSection */}
      {notesContext?.notesToShow.some((el) => el.pinned) && (
        <section className="notesSection">
          <AnimatedText className="title ms-2" text="Pinned" />
          <div className="notes">
            {notesContext?.notesToShow
              .filter((el) => el.pinned)
              .map((note: Note) => {
                return (
                  <NoteCard
                    key={note.id}
                    note={note}
                    setSelectedNote={setSelectedNote}
                  />
                );
              })}
          </div>
        </section>
      )}
      {/* notesSection */}
      <section className="notesSection">
        <div className="flex flex-col items-start">
          <AnimatedText className="title ms-2" text="My" />
          <AnimatedText className="title ms-2" text="Notes" />
        </div>
        <div className="notes">
          {notesContext?.notesToShow
            .filter((el) => el.pinned == false)
            .map((note: Note) => {
              return (
                <NoteCard
                  key={note.id}
                  note={note}
                  setSelectedNote={setSelectedNote}
                />
              );
            })}
        </div>
      </section>
    </div>
  );
}
