"use client";;
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";
import { deleteNote, updateNote } from "@/api/notes";

export default function NoteEditor() {
  const notesContext = useContext(NotesContext);

  const [foundNote, setFoundNote] = useState<Note | undefined>()

  useEffect(() => {
    setFoundNote(notesContext?.notes?.find(
      (el) => el.id === notesContext.selectedNote
    ))
  }, []);

  useEffect(() => {
    // when the component dismounts (so on modal close), trigger the updateNote method
    return () => {
      if (foundNote) {
        // if the user didn't input anything, delete the note to avoid empty notes
        if (foundNote.title == '' && foundNote.text == '') {
          let updatedNotes = notesContext!.notes.filter(note => note.id != foundNote.id)
          notesContext!.setNotes(updatedNotes);
          deleteNote(foundNote.id!)
        }
        else {
          updateNote(foundNote)
        }
      }
    }
  }, [foundNote]);

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