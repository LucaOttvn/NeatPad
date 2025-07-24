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

interface NoteEditorProps {
  note: Note | undefined
}

export default function NoteEditor(props: NoteEditorProps) {

  const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)
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
    if (event.key === 'Enter') {
      const { selectionStart: cursorPosition } = event.target as HTMLTextAreaElement;

      const txtToUpdate = currentNote?.text || '';
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

        setCurrentNote(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            text: newContent
          };
        });

        // Set the cursor position after the state update
        // Use setTimeout to ensure the DOM is updated before setting the cursor
        setTimeout(() => {
          if (textareaRef.current) {
            (textareaRef.current as HTMLTextAreaElement).selectionStart = newCursorPosition;
            (textareaRef.current as HTMLTextAreaElement).selectionEnd = newCursorPosition;
          }
        }, 0);
      }
    }
  };

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
    if (currentNote) debounceTimerRef.current = setTimeout(async () => {
      await updateNoteState(currentNote)
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
        {/* remarkBreaks is to put the text on a new line every time the user clicks on enter on the keyboard, since the default markdown behaviour is to put it inline */}
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{currentNote?.text == '' ? 'No text' : currentNote?.text}</ReactMarkdown>
      </div>}
      {
        !useMarkdown && <textarea
          className="noteEditorInputField"
          placeholder="Insert your note..."
          data-placeholder="Insert your note..."
          value={currentNote ? currentNote.text : ''}
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

