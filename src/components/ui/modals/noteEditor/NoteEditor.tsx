"use client";
import "./noteEditor.scss";
import { useContext, useEffect, useState } from "react";
import { Note } from "@/utils/interfaces";
import { NotesContext } from "@/contexts/notesContext";

interface NoteEditorProps {
  note: Note | undefined;
}

export default function NoteEditor(props: NoteEditorProps) {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  const notesContext = useContext(NotesContext);

  useEffect(() => {
    // initially set title and text based on the selected note
    if (props.note) {
      setTitle(props.note.title);
      setText(props.note.text);
    }
  }, [props.note]);

  useEffect(() => {
    if (props.note) {
      const updatedNote = props.note;
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
