"use client";;
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import "./noteEditor.scss";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Note } from "@/utils/interfaces";
import MarkdownToolbar from './MarkdownToolbar';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { db } from '@/utils/db';
import { notes } from '@/utils/signals';

interface NoteEditorProps {
  note: Note
}

interface NoteContent {
  title: string
  text: string
}

export default function NoteEditor(props: NoteEditorProps) {

  // const [currentNote, setCurrentNote] = useState<Note | undefined>(props.note)
  const [editMode, seteditMode] = useState<boolean>(false)

  const [noteContent, setNoteContent] = useState<NoteContent>({
    title: props.note.title,
    text: props.note.text,
  })

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

  useEffect(() => {
    const updateNotes = async () => {
      
      // update the local db
      await db.notes.update(props.note.id, { title: noteContent.title, text: noteContent.text, synced: false })
      const updatedNote = {...props.note, title: noteContent.title, text: noteContent.text, synced: false}
      // update the visualized array
      // notes.value = notes.value.map(note => {
      //   return note.id === props.note.id ? updatedNote: note
      // })
    }
    updateNotes()
  }, [noteContent]);

  return (
    <div className="noteEditorContainer">
      <div className='titleSection'>
        <input
          type="text"
          value={noteContent.title}
          placeholder="Insert title"
          onChange={(e) => {
            setNoteContent(prev => ({ ...prev, title: e.target.value }))
          }}
        />
      </div>

      <MarkdownToolbar editMode={editMode} seteditMode={seteditMode} />

      {!editMode && <div className='markdownContainer'>
        {/* remarkBreaks is to put the text on a new line every time the user clicks on enter on the keyboard, since the default markdown behaviour is to put it inline */}
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{noteContent.text == '' ? 'No text' : noteContent.text}</ReactMarkdown>
      </div>}
      {
        editMode && <textarea
          className="noteEditorInputField"
          placeholder="Insert your note..."
          data-placeholder="Insert your note..."
          ref={textareaRef}
          value={noteContent.text}
          onChange={(e) => {
            setNoteContent(prev => ({ ...prev, text: e.target.value }))
          }}
          onKeyDown={handleKeyDown}
        ></textarea>
      }
    </div >
  );
}

