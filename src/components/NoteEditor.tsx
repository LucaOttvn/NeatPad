'use client'
import { login } from "@/api/notes";
import { handleModal } from "@/utils/globalMethods";
import React, { useEffect } from "react";
import { ReactSVG } from "react-svg";

export default function NoteEditor() {

  useEffect(() => {
    login()
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
