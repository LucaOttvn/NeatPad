"use client";;
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createNote, updateNote } from "@/api/notes";

export default function NoteEditor() {
  const notesContext = useContext(NotesContext);

  const [foundNote, setFoundNote] = useState<Note | undefined>()

  useEffect(() => {
    let foundNoteTmp = notesContext?.notes?.find(
      (el) => el.id === notesContext.selectedNote
    );
    setFoundNote(foundNoteTmp)
    // when the modal closes, trigger the updateNote method
    return () => {
      if (foundNote) updateNote(foundNote)
    }
  }, []);

  function handleInput(keyToUpdate: 'title' | 'text', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // if updating an existing note
    if (foundNote) {
      foundNote[keyToUpdate] = e.target.value
      notesContext?.updateNoteState(foundNote)
    }
  }

  return (
    <div className="noteEditorContainer">
      <header>
        <input
          type="text"
          placeholder="Insert title"
          value={foundNote ? foundNote.title : ''}
          onChange={(e) => {
            handleInput('title', e)
          }}
        />
      </header>
      <textarea
        className="noteEditorInputField"
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
        value={foundNote ? foundNote.text : ''}
        onChange={(e) => {
          handleInput('text', e)
        }}
      ></textarea>
    </div>
  );
}