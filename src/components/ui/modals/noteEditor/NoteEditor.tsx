"use client";;
import "./noteEditor.scss";
import { useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";

export default function NoteEditor() {
  const notesContext = useContext(NotesContext);

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  const foundNote = notesContext?.notes?.find(
    (el) => el.id == notesContext.selectedNote
  );

  useEffect(() => {
    // initially set title and text based on the selected note
    if (foundNote) {
      setTitle(foundNote.title);
      setText(foundNote.text);
    }
  }, [foundNote]);

  useEffect(() => {
    if (foundNote) {
      const updatedNote = foundNote;
      updatedNote.title = title;
      updatedNote.text = text;
      notesContext?.setNotes(
        notesContext.notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    }
  }, [title, text]);

  return (
    <div className="noteEditorContainer">
      <header>
        <input
          type="text"
          placeholder="Insert title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </header>
      <textarea
        className="noteEditorInputField"
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></textarea>
    </div>
  );
}