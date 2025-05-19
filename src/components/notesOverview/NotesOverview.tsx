import { Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useContext, useEffect, useState } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import { NotesContext } from "@/contexts/notesContext";
import { FoldersContext } from "@/contexts/foldersContext";
import NotesSection from "../ui/NotesSection";
import { getNotes } from "@/api/notes";
import { getFolders } from "@/api/folders";

export default function NotesOverview() {
  const notesContext = useContext(NotesContext);
  const foldersContext = useContext(FoldersContext);

  const [notesToShow, setNotesToShow] = useState<Note[]>([])

  // if there's a selected folder set it
  const foundSelectedFolderData = foldersContext?.selectedFolder ? foldersContext?.folders.find(
    (el) => el.id == foldersContext.selectedFolder
  ) : undefined;

  useEffect(() => {
    // get notes and folders
    async function fetchData() {
      try {
        const [notes, folders] = await Promise.all([getNotes(), getFolders()]);

        if (notes) {
          setNotesToShow(notes);
          notesContext?.setNotes(notes);
        }
        if (folders) {
          foldersContext?.setFolders(folders);
        }
      } catch (err) {
        console.error("Error fetching initial data", err);
      }
    }

    fetchData();
  }, []);

  // listen for changes in the notes array or in the current folder
  useEffect(() => {
    // if there's a selected folder, filter the notes by it, otherwise show them all
    if (foldersContext?.selectedFolder) {
      const filteredNotes = notesContext?.notes.filter(note => note.folder == foldersContext?.selectedFolder)
      if (filteredNotes) setNotesToShow(filteredNotes)
    }
    else {
      if (notesContext) setNotesToShow(notesContext.notes)
    }
  }, [foldersContext?.selectedFolder, notesContext?.notes]);

  return (
    <div className="notesOverviewContainer">
      {foldersContext?.selectedFolder ? <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase()!} color={foundSelectedFolderData?.color} /> : <div className="flex flex-col items-start">
        <div className="blur"></div>
        <AnimatedText className="title" text="My" />
        <AnimatedText className="title ms-5" text="Notes" />
      </div>}
      {/* pinnedSection (show it only if there's at least one pinned note) */}
      {notesToShow.some((el) => el.pinned) && (
        <NotesSection
          notes={notesToShow.filter((el) => el.pinned)}
          title="Pinned"
        />
      )}

      {/* non-pinned notes section */}
      <NotesSection
        notes={notesToShow.filter((el) => !el.pinned)}
        title="Others"
      />
    </div>
  );
}
