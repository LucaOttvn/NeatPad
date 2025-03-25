import { colors, Folder, ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { handleModal } from "@/utils/globalMethods";
import { FolderContext } from "@/contexts/foldersContext";
import { useContext, useEffect, useState } from "react";

interface NoteCardProps {
  note: Note;
  setSelectedNote: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function NoteCard(props: NoteCardProps) {
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(
    undefined
  );
  const [textColor, setTextColor] = useState<string | undefined>(undefined);

  const folderContext = useContext(FolderContext);

  useEffect(() => {
    setSelectedFolder(
      folderContext?.folders.find((el) => el.id == folderContext.selectedFolder)
    );
  }, [folderContext?.selectedFolder]);

  useEffect(() => {
    if (selectedFolder) {
      const foundColor = colors.find(
        (item) => item.color == selectedFolder?.color
      );
      setTextColor(foundColor ? foundColor.text : "White");

      console.log(selectedFolder);
    }
  }, [selectedFolder]);

  return (
    <AnimatedDiv className="noteCard">
      <div
        className="cornerRounder1"
        style={{
          background: selectedFolder?.color
            ? `var(--${selectedFolder?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div
        className="cornerRounder2"
        style={{
          background: selectedFolder?.color
            ? `var(--${selectedFolder?.color})`
            : "var(--lightBlack)",
        }}
      ></div>
      <div className="cornerRounder3"></div>
      <div
        className="overflow-hidden"
        onClick={() => {
          props.setSelectedNote(props.note.id);
          handleModal(true, ModalsNames.updateNote);
        }}
      >
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
