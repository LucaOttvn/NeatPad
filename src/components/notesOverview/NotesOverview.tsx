import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteCard from "../noteCard/NoteCard";
import NoteEditor from "../noteEditor/NoteEditor";
import GeneralModal from "../ui/GeneralModal";
import { useEffect, useState } from "react";
import { getNotes } from "@/api/notes";

interface NotesOverviewProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function NotesOverview(props: NotesOverviewProps) {
  const [selectedNote, setSelectedNote] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="notesOverviewContainer">
      <GeneralModal id={ModalsNames.updateNote} width={80} height={80}>
        <NoteEditor
          setSelectedNote={setSelectedNote}
          setNotes={props.setNotes}
          note={props.notes.find((n) => n.id == selectedNote)}
        />
      </GeneralModal>
      {/* draftsSection */}
      <section className="notesSection"></section>
      {/* pinnedSection */}
      <section className="notesSection"></section>
      {/* notesSection */}
      <section className="notesSection">
        <h1 className="title ms-2">Your notes</h1>
        <div className="notes">
          {props.notes.map((note: Note) => {
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
