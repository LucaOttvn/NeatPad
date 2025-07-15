"use client";
import { deleteNote, updateNote } from "@/serverActions/notesActions";
import { Note } from "@/utils/interfaces";
import { createContext, ReactNode, useState } from "react";

interface NotesContextType {
  notes: Note[];
  setNotes: (Notes: Note[]) => void;
  selectedNote: number | undefined;
  setSelectedNote: (noteId: number | undefined) => void;
  updateNoteState: (note: Note) => void
  deleteMode: DeleteMode
  setDeleteMode: (notes: DeleteMode) => void
  handleNoteEditorClose: () => void
}

export interface DeleteMode {
  active: boolean
  notes: number[]
}

export const NotesContext = createContext<NotesContextType | undefined>(
  undefined
);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<number | undefined>();
  // this active toggle is necessary because of this use case:
  // When the user long presses a noteCard, the app enters the delete mode.
  // In this mode when the user clicks a card (without having to long press it again), it gets selected, so it's ready to be deleted
  // If an already selected noteCard gets clicked again, it gets de-selected
  // To handle all this, the simple array of notes would be enough, by checking if its length is > 0 in fact, it would be possible to know if the user is in "delete mode", because if there aren't notes in the array it means that the user didn't long press any card
  // The problem comes when there's just one selected card, in this case in fact the touchstart event on the card will trigger the deletion of it from the array of selected cards (disabling the delete mode as a consequence), but then, ontouchend, the array will be empty already and so that same "click" will trigger the opening of the update modal too (because that modal only shows up when the delete mode is disabled)
  // Therefore having a toggle like "active" makes possible to handle the case where notes.length is == 0 but the delete mode is just about to be disabled
  // (check the code in NoteCard.tsx)
  const [deleteMode, setDeleteMode] = useState<DeleteMode>({
    active: false, notes: []
  });

  // in the noteEditor modal, this updates the local notes array but the real db update happens when the user closes the create/update modal in order to avoid tons of api calls on each key press
  async function updateNoteState(note: Note) {
    setNotes(prevState =>
      prevState.map((el) =>
        el.id === note.id
          ? note
          : el
      )
    );
    await updateNote(note)
  }

  // this method handles the note's saving and, if it's empty, it deletes it
  async function handleNoteEditorClose() {

    const currentNote = notes.find((note) => note.id == selectedNote)

    if (currentNote) {
      // if note's title and text are empty, delete it
      if (currentNote.title === '' && currentNote.text === '') {
        let updatedNotes = notes.filter(note => note.id != currentNote?.id)
        setNotes(updatedNotes)
        // delete the note from db
        deleteNote(currentNote.id!)
      }
      // else {
      //   updateNoteState(currentNote)
      // }
    }
  }

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, selectedNote, setSelectedNote, updateNoteState, deleteMode, setDeleteMode, handleNoteEditorClose }}
    >
      {children}
    </NotesContext.Provider>
  );
}
