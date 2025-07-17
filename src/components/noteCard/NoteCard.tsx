import { colors, Folder, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { handleModal } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import { useContext, useEffect, useState } from "react";
import { NotesContext } from "@/contexts/notesContext";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard(props: NoteCardProps) {
  const [selectedFolderData, setSelectedFolderData] = useState<Folder | undefined>(
    undefined
  );
  const [textColor, setTextColor] = useState<string | undefined>(undefined);

  const foldersContext = useContext(FoldersContext);
  const notesContext = useContext(NotesContext);

  useEffect(() => {
    setSelectedFolderData(
      foldersContext?.folders.find((el) => el.id == foldersContext.selectedFolder)
    );
  }, [foldersContext?.selectedFolder]);

  useEffect(() => {
    if (selectedFolderData) {
      const foundColor = colors.find(
        (item) => item.color == selectedFolderData?.color
      );
      setTextColor(foundColor ? foundColor.text : "White");

      console.log(selectedFolderData);
    }
  }, [selectedFolderData]);

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
          background: selectedFolderData?.color
            ? `var(--${selectedFolderData?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder2"
        style={{
          background: selectedFolderData?.color
            ? `var(--${selectedFolderData?.color})`
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
