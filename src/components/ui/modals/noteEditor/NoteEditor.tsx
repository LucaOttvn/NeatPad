"use client";;
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import "./noteEditor.scss";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Note } from "@/utils/interfaces";
import gsap from 'gsap';
import MarkdownToolbar from './MarkdownToolbar';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { updateNoteState } from '@/utils/signals';
import { db } from '@/utils/db';

interface NoteEditorProps {
  note: Note | undefined
}

export default function NoteEditor(props: NoteEditorProps) {

  // const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)
  const [useMarkdown, setUseMarkdown] = useState<boolean>(true)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const textareaRef = useRef(null)

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') return
    const { selectionStart: cursorPosition } = event.target as HTMLTextAreaElement;

    const txtToUpdate = props.note?.text || '';
    const textBeforeCursor = txtToUpdate.substring(0, cursorPosition);
    const textAfterCursor = txtToUpdate.substring(cursorPosition);

    // find the beginning of the current line
    // if there's a newline character before the cursor, that marks the end of the previous line and the beginning of the current one
    const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
    // lastNewlineIndex !== -1 checks if a newline char was found in textBeforeCursor
    // textBeforeCursor.substring(lastNewlineIndex + 1) gets all the text from the beginning of the line apart from the /n, otherwise return the full standard string
    const currentLine = lastNewlineIndex !== -1
      ? textBeforeCursor.substring(lastNewlineIndex + 1)
      : textBeforeCursor;

    const optionsToCheck: RegExp[] = [/^\s*-/]

    let detectedCase
    optionsToCheck.find((el) => {
      const foundMatches = el.exec(currentLine)
      if (!foundMatches) return false
      detectedCase = foundMatches[0]
      return true
    })

    // when a user is on a list item and presses enter, create a new list item
    if (detectedCase) {
      event.preventDefault();

      const newContent = textBeforeCursor + `\n${detectedCase} ` + textAfterCursor;
      // update the cursor position because by default the cursor goes to the bottom of the textarea on its update
      const newCursorPosition = cursorPosition + `\n${detectedCase} `.length;

      let updatedNote: Note = { ...props.note, text: newContent } as Note
      db.notes.put(updatedNote)

      // Set the cursor position after the state update
      // Use setTimeout to ensure the DOM is updated before setting the cursor
      setTimeout(() => {
        if (textareaRef.current) {
          (textareaRef.current as HTMLTextAreaElement).selectionStart = newCursorPosition;
          (textareaRef.current as HTMLTextAreaElement).selectionEnd = newCursorPosition;
        }
      }, 0);
    }
  };

  const handleInput = async (keyToUpdate: 'title' | 'text', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    // if the user is typing in markdown mode, the type of e is different from the one that comes from the input field for the title or for the normal textarea
    const usingMarkdown = (keyToUpdate == 'text' && useMarkdown)
    let inputValue: string = usingMarkdown ? e as string : (e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value

    if (!props.note) return
    let updatedNote: Note = { ...props.note, [keyToUpdate]: inputValue, synced: false }
    await db.notes.put(updatedNote)
  }

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
          onChange={(e) => {
            handleInput('title', e)
          }}
        />
      </div>

      <MarkdownToolbar setUseMarkdown={setUseMarkdown} />

      {useMarkdown && <div className='markdownContainer'>
        {/* remarkBreaks is to put the text on a new line every time the user clicks on enter on the keyboard, since the default markdown behaviour is to put it inline */}
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{props.note?.text == '' ? 'No text' : props.note?.text}</ReactMarkdown>
      </div>}
      {
        !useMarkdown && <textarea
          className="noteEditorInputField"
          placeholder="Insert your note..."
          data-placeholder="Insert your note..."
          ref={textareaRef}
          onChange={(e) => {
            handleInput('text', e)
          }}
          onKeyDown={handleKeyDown}
        ></textarea>
      }
    </div >
  );
}

