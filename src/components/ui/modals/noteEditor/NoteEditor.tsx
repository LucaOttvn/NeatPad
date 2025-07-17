"use client";;
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import "./noteEditor.scss";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { Note } from "@/utils/interfaces";
import gsap from 'gsap';
import MarkdownToolbar from './MarkdownToolbar';
import ReactMarkdown from 'react-markdown';


interface NoteEditorProps {
  note: Note | undefined
}

export default function NoteEditor(props: NoteEditorProps) {
  const notesContext = useContext(NotesContext);

  const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)
  const [useMarkdown, setUseMarkdown] = useState<boolean>(true)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInput = (keyToUpdate: 'title' | 'text', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    // if the user is typing in markdown mode, the type of e is different from the one that comes from the input field for the title or for the normal textarea
    const usingMarkdown = (keyToUpdate == 'text' && useMarkdown)
    let inputValue: string = usingMarkdown ? e as string : (e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value

    if (currentNote) {
      setCurrentNote(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [keyToUpdate]: inputValue
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

  useEffect(() => {
    gsap.to('.view', {
      background: useMarkdown ? 'var(--Green)' : 'var(--darkGrey)',
      color: useMarkdown ? 'var(--Black)' : 'var(--White)',
      duration: 0.2,
      ease: 'power4.out'
    })
    gsap.to('.edit', {
      background: useMarkdown ? 'var(--darkGrey)' : 'var(--Green)',
      color: useMarkdown ? 'var(--White)' : 'var(--Black)',
      duration: 0.2,
      ease: 'power4.out'
    })
  }, [useMarkdown]);

  return (
    <div className="noteEditorContainer">
      <div className='titleSection'>
        <input
          type="text"
          placeholder="Insert title"
          value={currentNote ? currentNote.title : ''}
          onChange={(e) => {
            handleInput('title', e)
          }}
        />
      </div>

      <MarkdownToolbar setUseMarkdown={setUseMarkdown} />

      {useMarkdown && <div className='markdownContainer'>
        <ReactMarkdown>{currentNote?.text}</ReactMarkdown>
      </div>}
      {
        !useMarkdown && <textarea
          className="noteEditorInputField"
          placeholder="Insert your note..."
          data-placeholder="Insert your note..."
          value={currentNote ? currentNote.text : ''}
          onChange={(e) => {
            handleInput('text', e)
          }}
        ></textarea>
      }
    </div >
  );
}

