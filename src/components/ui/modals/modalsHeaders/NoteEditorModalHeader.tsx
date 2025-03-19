import { useEffect, useState } from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";
import { Note } from "@/utils/interfaces";

interface BasicComponentProps {
  onCloseCallback?: () => void;
  modalId: string;
  note: Note | undefined;
  updateNoteLocally: (updatedNote: Note) => void;
}

export default function NoteEditorModalHeader(props: BasicComponentProps) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (props.note) setPinned(props.note.pinned);
  }, [props.note?.pinned]);

  useEffect(() => {
    if (props.note) {
      const updatedNote = props.note;
      updatedNote.pinned = pinned;
      props.updateNoteLocally(updatedNote);
    }
  }, [pinned]);

  return (
    <header className="modalHeader">
      <div className="start gap-5">
        <SvgButton fileName={pinned ? "pinFill" : "pin"} onClick={() => {
          setPinned(!pinned)
        }} />
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
