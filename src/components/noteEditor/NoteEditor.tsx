"use client";
import { handleModal } from "@/utils/globalMethods";
import { ReactSVG } from "react-svg";
import "./noteEditor.scss";
import { useEffect } from "react";

export default function NoteEditor() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // this removes the automatica browser's focus on the button when esc is pressed
        document.activeElement instanceof HTMLElement &&
          document.activeElement.blur();
        handleModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        placeholder="Insert your note..."
        data-placeholder="Insert your note..."
      ></textarea>
    </div>
  );
}
