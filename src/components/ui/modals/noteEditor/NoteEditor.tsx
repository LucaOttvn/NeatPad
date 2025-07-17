"use client";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";
import MDEditor, { commands } from "@uiw/react-md-editor";

interface NoteEditorProps {
  note: Note | undefined
}

export default function NoteEditor(props: NoteEditorProps) {
  const notesContext = useContext(NotesContext);
  const textareaRef = useRef(null)

  const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelection = () => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd, value } = textareaRef.current;
      const selectedText = (value as string).substring(selectionStart, selectionEnd);
      console.log(selectedText);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInput = (keyToUpdate: 'title' | 'text', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {

    if (currentNote) {
      setCurrentNote(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [keyToUpdate]: keyToUpdate == 'title' ? (e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value : e,
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
      <MDEditor
        className="markdownEditor"
        height={'100%'}
        visibleDragbar={false}
        value={currentNote ? currentNote.text : ''}
        onChange={(e) => {
          handleInput('text', e || '')
        }}
        commands={[
          commands.bold, commands.italic, commands.codeBlock
        ]}
        extraCommands={[commands.codeEdit, commands.codePreview, commands.codeLive]}
        preview='preview'
      />
    </div>
  );
}

{/* <textarea
        ref={textareaRef}
        className="noteEditorInputField"
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
        value={currentNote ? currentNote.text : ''}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onChange={(e) => {
          handleInput('text', e)
        }}
      ></textarea> */}