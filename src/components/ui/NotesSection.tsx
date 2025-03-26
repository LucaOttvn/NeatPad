import { Note } from "@/utils/interfaces";
import React, { ReactNode } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
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
          return <NoteCard key={note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
