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
      <textarea
        className="noteEditorInputField"
        contentEditable
        onInput={() => {
          console.log("test");
        }}
        placeholder="Insert your note..."
      >
      </textarea>
    </div>
  );
}
