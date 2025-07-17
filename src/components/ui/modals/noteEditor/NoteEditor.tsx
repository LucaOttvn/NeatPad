"use client";;
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";

interface NoteEditorProps {
  note: Note | undefined
}

export default function NoteEditor(props: NoteEditorProps) {
  const notesContext = useContext(NotesContext);

  const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)


  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function handleInput(keyToUpdate: 'title' | 'text', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

    if (currentNote) {
      setCurrentNote(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [keyToUpdate]: e.target.value,
        };
      });
    }
  }

  useEffect(() => {
    // clear any existing timer to reset the debounce countdown
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // set a new timer to call saveNote after a delay
    if (currentNote) debounceTimerRef.current = setTimeout(() => {
      notesContext?.updateNoteState(currentNote)
    }, 500);
  }, [currentNote]);

  return (
    <div className="noteEditorContainer">
      <header>
        <input
          type="text"
          placeholder="Insert title"
          value={currentNote ? currentNote.title : ''}
          onChange={(e) => {
            handleInput('title', e)
          }}
        />
      </header>
      <textarea
        className="noteEditorInputField"
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
        value={currentNote ? currentNote.text : ''}
        onChange={(e) => {
          handleInput('text', e)
        }}
      ></textarea>
    </div>
  );
}