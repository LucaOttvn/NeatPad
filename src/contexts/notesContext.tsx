"use client";
import { Note } from "@/utils/interfaces";
import { createContext, ReactNode, useState } from "react";

interface NotesContextType {
  notes: Note[];
  setNotes: (Notes: Note[]) => void;
  notesToShow: Note[];
  setNotesToShow: (Notes: Note[]) => void;
}

export const NotesContext = createContext<NotesContextType | undefined>(
  undefined
);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesToShow, setNotesToShow] = useState<Note[]>([]);

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, notesToShow, setNotesToShow }}
    >
      {children}
    </NotesContext.Provider>
  );
}
