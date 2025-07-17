import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteCard from "../noteCard/NoteCard";
import NoteEditor from "../noteEditor/NoteEditor";
import GeneralModal from "../ui/modals/GeneralModal";
import { useContext, useEffect, useState } from "react";
import { getNotes, updateNote } from "@/api/notes";
import NoteEditorModalHeader from "../ui/modals/modalsHeaders/NoteEditorModalHeader";
import { UserContext } from "@/contexts/userContext";

export default function NotesOverview() {
  const [selectedNote, setSelectedNote] = useState<number | undefined>(
    undefined
  );

  const [notes, setNotes] = useState<Note[]>([]);

  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const notes = await getNotes();
      if (notes) setNotes(notes);
    })();
  }, []);

  return (
    <div className="notesOverviewContainer">
      <GeneralModal
        id={ModalsNames.updateNote}
        width={80}
        height={80}
        onCloseCallback={() => {
          updateNote(userContext!.user!.id);
        }}
      >
        <NoteEditorModalHeader
          modalId={ModalsNames.updateNote}
          onCloseCallback={() => {
            updateNote(userContext!.user!.id);
          }}
        />
        <NoteEditor
          setSelectedNote={setSelectedNote}
          setNotes={setNotes}
          note={notes.find((n) => n.id == selectedNote)}
        />
      </GeneralModal>

      <GeneralModal
        id={ModalsNames.newNote}
        width={80}
        height={80}
        onCloseCallback={() => {
          updateNote(userContext!.user!.id);
        }}
      >
        <NoteEditorModalHeader
          modalId={ModalsNames.newNote}
          onCloseCallback={() => {
            updateNote(userContext!.user!.id);
          }}
        />
        <NoteEditor setNotes={setNotes} note={undefined} />
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
