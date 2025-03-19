import React from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";

interface BasicComponentProps {
  onCloseCallback?: () => void;
  modalId: string
}

export default function NoteEditorModalHeader(props: BasicComponentProps) {
  return (
    <header className="modalHeader">
      <div className="start gap-5">
        <SvgButton fileName="pin" onClick={() => {}} />
        <SvgButton fileName="colorPalette" onClick={() => {}} />
      </div>
      <SvgButton
        fileName="close"
        onClick={() => {
          if (props.onCloseCallback) props.onCloseCallback();
          handleModal(false, props.modalId);
        }}
      />
    </header>
  );
}
