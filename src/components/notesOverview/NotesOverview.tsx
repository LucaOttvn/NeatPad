import { Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useContext, useEffect, useState } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import { NotesContext } from "@/contexts/notesContext";
import { FoldersContext } from "@/contexts/foldersContext";
import NotesSection from "../ui/NotesSection";

export default function NotesOverview() {
  const notesContext = useContext(NotesContext);
  const foldersContext = useContext(FoldersContext);

  const foundSelectedFolderData = foldersContext?.folders.find(
    (el) => el.id == foldersContext.selectedFolder
  );

  const [notesToShow, setNotesToShow] = useState<Note[]>([])

  useEffect(() => {
    if (foldersContext?.selectedFolder) {
      const filteredNotes = notesContext?.notes.filter(note => note.folder == foldersContext?.selectedFolder)
      console.log(filteredNotes)
      if (filteredNotes) setNotesToShow(filteredNotes)
    }
    else {
      if (notesContext) {
        console.log(notesContext.notes)
        setNotesToShow(notesContext.notes)
      }
    }
  }, [foldersContext?.selectedFolder]);

  return (
    <div className="notesOverviewContainer">

      {foldersContext?.selectedFolder ? <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase()!} color={foundSelectedFolderData?.color} /> : <div className="flex flex-col items-start">
        <div className="blur"></div>
        <AnimatedText className="title" text="My" />
        <AnimatedText className="title ms-5" text="Notes" />
      </div>}
      {/* pinnedSection (show it only if there's at least one pinned note) */}
      {(foldersContext?.selectedFolder ? notesToShow : notesContext!.notes).some((el) => el.pinned) && (
        <NotesSection
          notes={(foldersContext?.selectedFolder ? notesToShow : notesContext!.notes).filter((el) => el.pinned)}
          title="Pinned"
        />
      )}

      {/* non-pinned notes section */}
      <NotesSection
        notes={(foldersContext?.selectedFolder ? notesToShow : notesContext!.notes).filter((el) => !el.pinned)}
        title="Others"
      />
    </div>
  );
}
