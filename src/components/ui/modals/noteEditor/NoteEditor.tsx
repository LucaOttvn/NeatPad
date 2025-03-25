"use client";
import "./noteEditor.scss";
import { useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";

export default function NoteEditor() {
  const notesContext = useContext(NotesContext);

  const [selectedNoteData, setSelectedNoteData] = useState<Note | undefined>(
    undefined
  );

  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const foundNote = notesContext?.notes?.find(
      (el) => el.id == notesContext.selectedNote
    );
    if (foundNote) setSelectedNoteData(foundNote);
  }, [notesContext?.selectedNote]);

  useEffect(() => {
    // initially set title and text based on the selected note
    if (selectedNoteData) {
      setTitle(selectedNoteData.title);
      setText(selectedNoteData.text);
    }
  }, [selectedNoteData]);

  useEffect(() => {
    if (selectedNoteData) {
      const updatedNote = selectedNoteData;
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
