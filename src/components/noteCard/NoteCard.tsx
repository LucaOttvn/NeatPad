import { colors, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { handleModal } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import { useContext } from "react";
import { NotesContext } from "@/contexts/notesContext";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  const foldersContext = useContext(FoldersContext);
  const notesContext = useContext(NotesContext);

  const foundSelectedFolderData = foldersContext?.folders.find(
    (el) => el.id == foldersContext.selectedFolder
  );

  const textColor = colors.find(
    (item) => item.color == foundSelectedFolderData?.color
  )?.text || "White"

  return (
    <AnimatedDiv
      className="noteCard"
      onClick={() => {
        notesContext?.setSelectedNote(props.note.id);
        handleModal(true, ModalsNames.updateNote);
      }}
    >
      <div
        className="cornerRounder1"
        style={{
          background: foundSelectedFolderData?.color
            ? `var(--${foundSelectedFolderData?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder2"
        style={{
          background: foundSelectedFolderData?.color
            ? `var(--${foundSelectedFolderData?.color})`
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
