import { ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import { handleModal } from "@/utils/globalMethods";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";

interface NoteCardProps {
  note: Note;
  setSelectedNote: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function NoteCard(props: NoteCardProps) {
  
  return (
    <AnimatedDiv
      className="noteCard"
      onClick={() => {
        props.setSelectedNote(props.note.id)
        handleModal(true, ModalsNames.updateNote);
      }}
    >
      {props.note.title ? <h1>{props.note.title}</h1> : <h1 style={{color: 'var(--grey)'}}>No title</h1>}
      {props.note.text ? <span>{props.note.text}</span> : <span style={{color: 'var(--grey)'}}>No text</span>}
    </AnimatedDiv>
  );
}
