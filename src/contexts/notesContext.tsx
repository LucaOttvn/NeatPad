"use client";
import { Note } from "@/utils/interfaces";
import { createContext, ReactNode, useState } from "react";

interface NotesContextType {
  notes: Note[];
  setNotes: (Notes: Note[]) => void;
}

export const NotesContext = createContext<NotesContextType | undefined>(
  undefined
);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <NotesContext.Provider
      value={{ notes, setNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
}
