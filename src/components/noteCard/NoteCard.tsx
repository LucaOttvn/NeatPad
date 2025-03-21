import { ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { handleModal } from "@/utils/globalMethods";

interface NoteCardProps {
  note: Note;
  setSelectedNote: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function NoteCard(props: NoteCardProps) {
  return (
    <AnimatedDiv
      className="noteCard"
    >
      <div className="cornerRounder1"></div>
      <div className="cornerRounder2"></div>
      <div className="cornerRounder3"></div>
      <div className="overflow-hidden" onClick={() => {
        props.setSelectedNote(props.note.id);
        handleModal(true, ModalsNames.updateNote);
      }}>
        {props.note.title ? (
          <h1>{props.note.title}</h1>
        ) : (
          <h1 style={{ color: "var(--grey)" }}>No title</h1>
        )}
        {props.note.text ? (
          <span>{props.note.text}</span>
        ) : (
          <span style={{ color: "var(--grey)" }}>No text</span>
        )}
      </div>
    </AnimatedDiv>
  );
}
