import { colors, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { handleModal } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import { useContext, useEffect } from "react";
import { NotesContext } from "@/contexts/notesContext";
import { ModalsContext } from "@/contexts/modalsContext";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  const foldersContext = useContext(FoldersContext);
  const notesContext = useContext(NotesContext);
  const modalsContext = useContext(ModalsContext);

  const foundParentFolder = foldersContext?.folders.find((el) =>
    props.note.id ? el.notes.includes(props.note.id) : undefined
  );

  const textColor =
    colors.find((item) => item.color == foundParentFolder?.color)?.text ||
    "White";

  return (
    <AnimatedDiv
      className="noteCard"
      onClick={() => {
        notesContext?.setSelectedNote(props.note.id);
        modalsContext?.setSelectedModal(ModalsNames.updateNote)
      }}
    >
      <div
        className="cornerRounder1"
        style={{
          background: foundParentFolder?.color
            ? `var(--${foundParentFolder?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder2"
        style={{
          background: foundParentFolder?.color
            ? `var(--${foundParentFolder?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div className="cornerRounder3"></div>
      <div className="overflow-hidden">
        {props.note.title ? (
          <h1 style={{ color: textColor ? `var(--${textColor})` : "auto" }}>
            {props.note.title}
          </h1>
        ) : (
          <h1 style={{ color: "var(--Grey)" }}>No title</h1>
        )}
        {props.note.text ? (
          <span style={{ color: textColor ? `var(--${textColor})` : "auto" }}>
            {props.note.text}
          </span>
        ) : (
          <span style={{ color: "var(--Grey)" }}>No text</span>
        )}
      </div>
    </AnimatedDiv>
  );
}
