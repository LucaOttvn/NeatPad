"use client";
import { getNotes, updateNote } from "@/api/notes";
import { Note } from "@/utils/interfaces";
import { createContext, ReactNode, useEffect, useState } from "react";

interface NotesContextType {
  notes: Note[];
  setNotes: (Notes: Note[]) => void;
  selectedNote: number | undefined;
  setSelectedNote: (noteId: number | undefined) => void;
  updateNoteState: (note: Note) => void
}

export const NotesContext = createContext<NotesContextType | undefined>(
  undefined
);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      const fetchedNotes = await getNotes();
      if (fetchedNotes) {
        setNotes(fetchedNotes);
      }
    })();
  }, []);


  function updateNoteState(note: Note) {
    setNotes(prevState =>
      prevState.map((el) =>
        el.id === note.id
          ? { ...el, title: note.title, text: note.text, last_update: note.last_update }
          : el
      )
    );
    updateNote(note)
  }

  useEffect(() => {
    console.log(notes)
  }, [notes]);

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, selectedNote, setSelectedNote, updateNoteState }}
    >
      {children}
    </NotesContext.Provider>
  );
}
