import { Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useContext, useEffect, useState } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import { NotesContext } from "@/contexts/notesContext";
import { FoldersContext } from "@/contexts/foldersContext";
import NotesSection from "../ui/NotesSection";
import { getNotes } from "@/api/notes";
import { getFolders } from "@/api/folders";
import { UserContext } from "@/contexts/userContext";
import { ReactSVG } from "react-svg";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import Loader from "../ui/Loader";

export default function NotesOverview() {
  const notesContext = useContext(NotesContext);
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);

  const [notesToShow, setNotesToShow] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)

  // if there's a selected folder set it
  const foundSelectedFolderData = foldersContext?.selectedFolder ? foldersContext?.folders.find(
    (el) => el.id == foldersContext.selectedFolder
  ) : undefined;

  useEffect(() => {
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

  // get notes and folders
  async function fetchData() {
    setLoading(true)
    setTimeout(async () => {
      try {
        const [notes, folders] = await Promise.all([getNotes(userContext?.user!.id!), getFolders()]);

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
      setLoading(false)
    }, 2000);
  }

  useEffect(() => {
    console.log(loading)
  }, [loading]);

  return (
    <div className="notesOverviewContainer">

      {loading && <Loader />}

      <div className="w-full flex pe-3">
        {foldersContext?.selectedFolder ? <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase()!} color={foundSelectedFolderData?.color} /> : <div className="flex flex-col items-start">
          <AnimatedText className="title" text="My" />
          <AnimatedText className="title ms-5" text="Notes" />
        </div>}
        <div className="w-full end">
          <AnimatedDiv>
            <button className="mainBtn w-full end gap-1" style={{ padding: '0.7rem' }} onClick={() => {fetchData()}}>
              <ReactSVG src={`/icons/refresh.svg`} className="icon" style={{ scale: 1.2 }} />
            </button>
          </AnimatedDiv>
        </div>
      </div>
      {/* pinnedSection (show it only if there's at least one pinned note) */}
      {notesToShow.some((el) => el.pinned) && (
        <NotesSection
          notes={notesToShow.filter((el) => el.pinned)}
          title="Pinned"
        />
      )}

      {/* non-pinned notes section */}
      {notesToShow.length > 0 ? <NotesSection
        notes={notesToShow.filter((el) => !el.pinned)}
        title="Others"
      /> : <div className="w-full h-full center">
        You haven't saved any notes yet
      </div>}

    </div>
  );
}
