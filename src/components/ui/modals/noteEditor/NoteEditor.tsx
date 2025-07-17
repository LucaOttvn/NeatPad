"use client";;
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";
import { App } from "@capacitor/app";

interface NoteEditorProps {
  note: Note | undefined
}

export default function NoteEditor(props: NoteEditorProps) {
  const notesContext = useContext(NotesContext);

  const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)

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

  async function monitorAppState() {
    let state = await App.getState();
    
    App.addListener('appStateChange', (state) => { 
      if (!state.isActive) {
        console.log(state)
      }
    })
  }

  useEffect(() => {
    monitorAppState()
  }, []);

  // this keeps the context's state up to date with the new local changes on each keystroke 
  useEffect(() => {
    if (currentNote) {
      notesContext?.updateNoteState(currentNote)
    }
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