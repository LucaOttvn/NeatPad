import { handleModal } from "@/utils/globalMethods";
import React, { useRef } from "react";
import { ReactSVG } from "react-svg";

interface NoteEditorProps {}

export default function NoteEditor(props: NoteEditorProps) {
  const noteRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="noteEditorContainer">
      <header>
        <input type="text" placeholder="Insert title" />
        <ReactSVG
          src="/icons/close.svg"
          className="iconBtn"
          onClick={() => {
            handleModal();
          }}
        />
      </header>
      <div
        className="noteEditorInputField"
        contentEditable
        data-placeholder="Insert your note..."
      >
      </div>
    </div>
  );
}
