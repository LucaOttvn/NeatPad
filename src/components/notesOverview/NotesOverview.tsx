import { Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useContext, useEffect, useState } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import { NotesContext } from "@/contexts/notesContext";
import { FoldersContext } from "@/contexts/foldersContext";
import NotesSection from "../ui/NotesSection";
import { UserContext } from "@/contexts/userContext";
import { ReactSVG } from "react-svg";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import { getFoldersByUserId } from "@/db/folders";
import { getNotesByUserId } from "@/db/notes";
import { loading } from "@/utils/signals";
import SearchBar from "../ui/searchBar/SearchBar";
import { compareStrings } from "@/utils/globalMethods";


export default function NotesOverview() {
  const notesContext = useContext(NotesContext);
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);

  const [notesToShow, setNotesToShow] = useState<Note[]>([])
  const [search, setSearch] = useState('')

  // if there's a selected folder set it
  const foundSelectedFolderData = foldersContext?.selectedFolder ? foldersContext?.folders.find(
    (el) => el.id == foldersContext.selectedFolder
  ) : undefined;

  useEffect(() => {
    loading.value = true
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

  useEffect(() => {
    filterNotesToShow()
  }, [notesToShow]);

  function filterNotesToShow() {

  }

  // get notes and folders
  async function fetchData() {
    try {
      const [notes, folders] = await Promise.all([getNotesByUserId(userContext?.user!.id!), getFoldersByUserId(userContext?.user?.id!)]);

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
    loading.value = false
  }

  // when the user searches for something, check if the search param is included somewhere in the title or in the text of any note and, if it is, show it. Check on the pinned param too
  function filterNotes(notes: Note[], searchParam: string, pinned: boolean) {
    return notes.filter(el =>
      (pinned ? el.pinned : !el.pinned) &&
      compareStrings({ noteText: el.text, noteTitle: el.title, searchParam })
    );
  };

  const pinnedFilteredNotes = filterNotes(notesToShow, search, true);

  return (
    <div className="notesOverviewContainer">
      <div className="w-full flex flex-col gap-5">
        {foldersContext?.selectedFolder && <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase()!} color={foundSelectedFolderData?.color} />}
        {!foldersContext?.selectedFolder && <div className="flex flex-col items-start">
          <AnimatedText className="title" text="My" />
          <AnimatedText className="title ms-5" text="Notes" />
        </div>}
        <AnimatedDiv className="w-full flex gap-5 start">
          <button className="mainBtn w-full end gap-2" style={{ padding: '0.6rem 0.8rem' }} onClick={() => { fetchData() }}>
            <ReactSVG src={`/icons/refresh.svg`} className="icon" style={{ scale: 1.2 }} />
          </button>
          <SearchBar search={search} setSearch={setSearch} />
        </AnimatedDiv>
      </div>
      {/* pinnedSection (show it only if there's at least one pinned note) */}
      {pinnedFilteredNotes.length > 0 && (
        <NotesSection
          notes={pinnedFilteredNotes}
          title="Pinned"
        />
      )}

      {/* non-pinned notes section */}
      {notesToShow.length > 0 ? <NotesSection
        notes={filterNotes(notesToShow, search, false)}
        title="Others"
      /> : <div className="w-full h-full center">
        You haven't saved any notes yet
      </div>}
    </div>
  );
}
