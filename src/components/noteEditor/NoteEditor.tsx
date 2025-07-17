"use client";
import { handleModal } from "@/utils/globalMethods";
import "./noteEditor.scss";
import { useContext, useEffect, useState } from "react";
import SvgButton from "../ui/SvgButton";
import { SelectedNoteContext } from "@/utils/contexts";
import { Note } from "@/utils/interfaces";

interface NoteEditorProps {
  note: Note | undefined;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function NoteEditor(props: NoteEditorProps) {
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // this removes the automatic browser's focus on the button when esc is pressed
        document.activeElement instanceof HTMLElement &&
          document.activeElement.blur();
        handleModal(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (props.note) setTitle(props.note.title);
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
        <SvgButton
          fileName="close"
          callback={() => {
            handleModal(false);
          }}
        />
      </header>
      <textarea
        className="noteEditorInputField"
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
        // value={noteContext?.note?.text}
      ></textarea>
    </div>
  );
}
