import { Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import NoteCard from "../noteCard/NoteCard";

interface NotesOverviewProps {
  notes: Note[];
}

export default function NotesOverview(props: NotesOverviewProps) {
  return (
    <div className="notesOverviewContainer">
      {/* draftsSection */}
      <section className="notesSection"></section>
      {/* pinnedSection */}
      <section className="notesSection"></section>
      {/* notesSection */}
      <section className="notesSection">
        <h1 className="title ms-2">Your notes</h1>
        <div className="notes">
          {props.notes.map((note: Note) => {
            return <NoteCard key={note.id} note={note} />;
          })}
        </div>
      </section>
    </div>
  );
}
