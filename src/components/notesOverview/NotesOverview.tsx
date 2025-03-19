import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteCard from "../noteCard/NoteCard";
import NoteEditor from "../noteEditor/NoteEditor";
import GeneralModal from "../ui/modals/GeneralModal";
import { useEffect, useState } from "react";
import { getNotes, updateNote } from "@/api/notes";
import NoteEditorModalHeader from "../ui/modals/modalsHeaders/NoteEditorModalHeader";

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
    console.log(updatedNote)
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  }
  
  function updateNoteOnModalClose() {
    const selectedNoteData = notes.find((n) => n.id === selectedNote);
    if (selectedNoteData) updateNote(selectedNoteData.id!, selectedNoteData.title, selectedNoteData.text)
    setSelectedNote(undefined)
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
          modalId={ModalsNames.newNote}
          onCloseCallback={() => {
            updateNoteOnModalClose();
          }}
        />
        <NoteEditor
          updateNoteLocally={updateNoteLocally}
          note={undefined}
        />
      </GeneralModal>

      {/* pinnedSection */}
      <section className="notesSection"></section>
      {/* notesSection */}
      <section className="notesSection">
        <h1 className="title ms-2">Your notes</h1>
        <div className="notes">
          {notes.map((note: Note) => {
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
