"use client";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import "./noteEditor.scss";
import { useEffect, useRef, useState } from "react";
import { Note } from "@/utils/interfaces";
import MarkdownToolbar from './MarkdownToolbar';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { db } from '@/utils/db';
import { useGetCurrentNote } from '@/hooks/useGetCurrentNote';

// on every keystroke of the user, the component updates the useGetCurrentNote.note state
// then, the component detects it through a useEffect[note] and updates the local db
export default function NoteEditor() {

  const [editMode, seteditMode] = useState<boolean>(false)

  const [note, setNote] = useGetCurrentNote()

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

    const txtToUpdate = note?.text || '';
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

      let updatedNote: Note = { ...note, text: newContent } as Note
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
    const updateNote = async () => {
      if (!note) return
      // this is the basic starting point of the note before any update
      const baseVersion = await db.notes.get(note.id)

      if (!baseVersion) return

      // check if the current note's base version is included in it already
      const isBaseVersionAlreadySaved = await db.notesBaseVersions.get(baseVersion.id)

      // if there are no differences, don't update the note, this avoids to trigger an update by just opening a note
      if (baseVersion.title === note.title && baseVersion.text === note.text) {
        
        // the base version of the note has to stay in db.notesBaseVersions only when there actually is an update to do, so, if there are no differences, remove it from the array
        if (isBaseVersionAlreadySaved) await db.notesBaseVersions.delete(baseVersion.id)
        return
      }

      if (!isBaseVersionAlreadySaved) await db.notesBaseVersions.put(baseVersion)

      await db.notes.update(note.id, { title: note.title, text: note.text, last_update: new Date(), synced: false })
    }
    updateNote()
  }, [note]);

  if (!note) return <span>No note</span>

  return (
    <div className="noteEditorContainer">
      <div className='titleSection'>
        <input
          type="text"
          value={note?.title}
          placeholder="Insert title"
          onChange={(e) => {
            setNote(prev => ({ ...prev!, title: e.target.value }))
          }}
        />
      </div>

      <MarkdownToolbar editMode={editMode} seteditMode={seteditMode} />

      {!editMode && <div className='markdownContainer'>
        {/* remarkBreaks is to put the text on a new line every time the user clicks on enter on the keyboard, since the default markdown behaviour is to put it inline */}
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{note.text == '' ? 'No text' : note.text}</ReactMarkdown>
      </div>}
      {
        editMode && <textarea
          className="noteEditorInputField"
          placeholder="Insert your note..."
          data-placeholder="Insert your note..."
          ref={textareaRef}
          value={note.text}
          onChange={(e) => {
            setNote(prev => ({ ...prev!, text: e.target.value }))
          }}
          onKeyDown={handleKeyDown}
        ></textarea>
      }
    </div >
  );
}

