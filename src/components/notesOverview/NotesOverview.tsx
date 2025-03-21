import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteCard from "../noteCard/NoteCard";
import NoteEditor from "../noteEditor/NoteEditor";
import GeneralModal from "../ui/modals/GeneralModal";
import { useEffect, useState } from "react";
import { getNotes, updateNote } from "@/api/notes";
import NoteEditorModalHeader from "../ui/modals/modalsHeaders/NoteEditorModalHeader";
import AnimatedText from "../animatedComponents/AnimatedText";

export default function NotesOverview() {
  const [selectedNote, setSelectedNote] = useState<number | undefined>(
    undefined
  );
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedNotes = await getNotes();
      if (fetchedNotes) setNotes(fetchedNotes);
    })();
  }, []);

  function updateNoteLocally(updatedNote: Note) {
    console.log(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  }

  function updateNoteOnModalClose() {
    const selectedNoteData = notes.find((n) => n.id === selectedNote);
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
          updateNoteLocally={updateNoteLocally}
          note={notes.find((n) => n.id === selectedNote)}
          modalId={ModalsNames.updateNote}
          onCloseCallback={() => {
            updateNoteOnModalClose();
          }}
        />
        <NoteEditor
          updateNoteLocally={updateNoteLocally}
          note={notes.find((n) => n.id === selectedNote)}
        />
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
          updateNoteLocally={updateNoteLocally}
          note={notes.find((n) => n.id === selectedNote)}
          modalId={ModalsNames.newNote}
          onCloseCallback={() => {
            updateNoteOnModalClose();
          }}
        />
        <NoteEditor updateNoteLocally={updateNoteLocally} note={undefined} />
      </GeneralModal>

      {/* pinnedSection */}
      {notes.some((el) => el.pinned) && (
        <section className="notesSection">
          <AnimatedText className="title ms-2" text="Pinned" />
          <div className="notes">
            {notes
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
          {notes
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
