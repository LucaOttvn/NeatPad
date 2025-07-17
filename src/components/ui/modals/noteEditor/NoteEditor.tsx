"use client";;
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createNote } from "@/api/notes";

export default function NoteEditor() {
  const notesContext = useContext(NotesContext);
  const userContext = useContext(UserContext);

  const foundNote = notesContext?.notes?.find(
    (el) => el.id == notesContext.selectedNote
  );

  function handleInput(keyToUpdate: 'title' | 'text', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // if updating an existing note
    if (foundNote) {
      foundNote[keyToUpdate] = e.target.value
      notesContext?.updateNoteState(foundNote)
    }
    // if creating a new note
    else {
      const newNote: Note = {
        user: userContext!.user!.id,
        title: keyToUpdate == 'title' ? e.target.value : '',
        text: keyToUpdate == 'text' ? e.target.value : '',
        last_update: new Date(),
        pinned: false
      }
      const updatedNotes = [...notesContext!.notes, newNote]
      notesContext?.setNotes(updatedNotes)
      createNote(newNote)
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