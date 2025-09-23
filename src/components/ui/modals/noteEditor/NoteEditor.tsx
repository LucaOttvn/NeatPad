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

// NoteEditor component that allows editing notes with debounced updates to local indexedDB

export default function NoteEditor() {

  const [editMode, seteditMode] = useState<boolean>(false);

  // note state from a custom hook that tracks the current note
  const [note, setNote] = useGetCurrentNote();

  // ref to store the debounce timer for database updates
  const debounceUpdateRef = useRef<NodeJS.Timeout | null>(null);

  // ref to store the debounce timer for component unmount cleanup
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // textarea ref to control cursor position on formatting newlines
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (debounceUpdateRef.current) {
        clearTimeout(debounceUpdateRef.current);
      }
    };
  }, []);

  // debounced effect to update the note in db on changes to the note state
  useEffect(() => {
    if (debounceUpdateRef.current) {
      clearTimeout(debounceUpdateRef.current);
    }

    debounceUpdateRef.current = setTimeout(() => {
      const updateNote = async () => {
        if (!note) return;
        // get base version stored in the DB for comparison
        const baseVersion = await db.notes.get(note.id);
        if (!baseVersion) return;

        // check if base version is already saved in a separate table
        const isBaseVersionAlreadySaved = await db.notesBaseVersions.get(baseVersion.id);

        // don't update if no changes compared to base version, remove base version if saved
        if (baseVersion.title === note.title && baseVersion.text === note.text) {
          if (isBaseVersionAlreadySaved) await db.notesBaseVersions.delete(baseVersion.id);
          return;
        }

        // save base version if not already saved before updating
        if (!isBaseVersionAlreadySaved) await db.notesBaseVersions.put(baseVersion);

        // update note with new content, timestamp, and sync status
        await db.notes.update(note.id, {
          title: note.title,
          text: note.text,
          last_update: new Date(),
          synced: false,
        });
      };
      updateNote();
    }, 500); // debounce delay

    // cleanup debounce on effect re-run or unmount
    return () => {
      if (debounceUpdateRef.current) {
        clearTimeout(debounceUpdateRef.current);
      }
    };
  }, [note]);

  if (!note) return <span>No note</span>;

  return (
    <div className="noteEditorContainer">
      <div className='titleSection'>
        <input
          type="text"
          value={note?.title}
          placeholder="Insert title"
          onChange={(e) => {
            setNote(prev => ({ ...prev!, title: e.target.value }));
          }}
        />
      </div>

      <MarkdownToolbar editMode={editMode} seteditMode={seteditMode} />

      {!editMode && (
        <div className='markdownContainer'>
          {/* remarkBreaks: add line breaks on Enter key */}
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {note.text === '' ? 'No text' : note.text}
          </ReactMarkdown>
        </div>
      )}

      {editMode && (
        <textarea
          className="noteEditorInputField"
          placeholder="Insert your note..."
          data-placeholder="Insert your note..."
          ref={textareaRef}
          value={note.text}
          onChange={(e) => {
            setNote(prev => ({ ...prev!, text: e.target.value }));
          }}
        />
      )}
    </div>
  );
}
