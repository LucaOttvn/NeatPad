import { ModalsNames, Note } from "@/utils/interfaces";
import "./noteCard.scss";
import { handleModal } from "@/utils/globalMethods";

interface NoteCardProps {
  note: Note;
  setSelectedNote: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function NoteCard(props: NoteCardProps) {
  
  return (
    <div
      className="noteCard"
      onClick={() => {
        props.setSelectedNote(props.note.id)
        handleModal(true, ModalsNames.updateNote);
      }}
    >
      {props.note.title ? <h1 className="title">{props.note.title}</h1> : <h1 className="title" style={{color: 'var(--grey)'}}>No title</h1>}
      <span>{props.note.text}</span>
    </div>
  );
}
