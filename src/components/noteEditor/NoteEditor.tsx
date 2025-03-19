"use client";
import { handleModal } from "@/utils/globalMethods";
import "./noteEditor.scss";
import { useEffect, useState } from "react";
import SvgButton from "../ui/SvgButton";
import { Note } from "@/utils/interfaces";

interface NoteEditorProps {
  note: Note | undefined;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setSelectedNote?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function NoteEditor(props: NoteEditorProps) {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // this removes the automatic browser's focus on the button when esc is pressed
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        handleModal(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (props.note) {
      setTitle(props.note.title);
      setText(props.note.text);
    }
  }, [props.note]);

  return (
    <div className="noteEditorContainer">
      <header>
        <input
          type="text"
          placeholder="Insert title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
      </header>
      <textarea
        className="noteEditorInputField"
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
    </div>
  );
}
