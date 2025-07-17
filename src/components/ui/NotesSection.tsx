import { Note } from "@/utils/interfaces";
import NoteCard from "../noteCard/NoteCard";

interface NotesSectionProps {
  notes: Note[];
  title: string;
}

export default function NotesSection(props: NotesSectionProps) {
  return (
    <div className="notesSection">
      <span className="smallTitle">{props.title}</span>
      <div className="notes">
        {props.notes.map((note: Note) => {
          return <NoteCard key={'noteCard' + note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
