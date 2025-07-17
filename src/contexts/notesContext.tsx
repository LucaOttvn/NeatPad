"use client";
import { getNotes } from "@/api/notes";
import { Note } from "@/utils/interfaces";
import { createContext, ReactNode, useEffect, useState } from "react";

interface NotesContextType {
  notes: Note[];
  setNotes: (Notes: Note[]) => void;
  selectedNote: number | undefined;
  setSelectedNote: (noteId: number | undefined) => void;
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

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, selectedNote, setSelectedNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}
