import { ModalsNames } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useContext, useEffect } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import { FoldersContext } from "@/contexts/foldersContext";
import NotesSection from "../ui/NotesSection";
import { UserContext } from "@/contexts/userContext";
import { ReactSVG } from "react-svg";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";

import { folders, loading, notes, notesToShow, selectedModal } from "@/utils/signals";
import SearchBar from "../ui/searchBar/SearchBar";
import { getNotesByUserEmail } from "@/serverActions/notesActions";
import { getFoldersByUserId } from "@/serverActions/foldersActions";

interface NotesCompareParams {
  noteText: string
  noteTitle: string
  searchParam: string
}

export default function NotesOverview() {
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);

  // if there's a selected folder set it
  const foundSelectedFolderData = foldersContext?.selectedFolder ? folders.value.find(
    (el) => el.id == foldersContext.selectedFolder
  ) : undefined;

  useEffect(() => {
    loading.value = true
    fetchNotesAndFolders();
  }, []);

  // listen for changes in the notes array or in the current folder
  useEffect(() => {

    notesToShow.value = notes.value

    // if there's a selected folder, filter the notes by it, otherwise show them all
    if (foldersContext?.selectedFolder) {
      const filteredNotes = notes.value.filter(note => note.folders.some(el => el == foldersContext?.selectedFolder))
      if (filteredNotes) notesToShow.value = filteredNotes
    }
  }, [foldersContext?.selectedFolder, notes.value]);

  // get notes and folders
  async function fetchNotesAndFolders() {
    try {
      if (!userContext || !userContext.user || !userContext.user.id || !userContext.user.email) return

      notes.value = (await getNotesByUserEmail(userContext.user.id, userContext.user.email)) || []
      notesToShow.value = notes.value
      const foldersFound = (await getFoldersByUserId(userContext?.user?.id!)) || []
      if (folders.value) folders.value = foldersFound
    } catch (err) {
      console.error("Error fetching initial data", err);
    }
    loading.value = false
  }

  function setEditingFolder() {
    foldersContext?.setUpdatingFolder(foldersContext.selectedFolder)
    selectedModal.value = ModalsNames.folderHandler
  }

  return (
    <div className="notesOverviewContainer">
      {/* title & search section */}
      <div className="w-full flex flex-col gap-5">
        {foldersContext?.selectedFolder && <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase() || ''} color={foundSelectedFolderData?.color} />}
        {!foldersContext?.selectedFolder && <div className="flex flex-col items-start">
          <AnimatedText className="title" text="My" />
          <AnimatedText className="title ms-5" text="Notes" />
        </div>}
        <AnimatedDiv className="w-full flex flex-wrap gap-5 start">
          <button className="mainBtn w-full end gap-2" style={{ padding: '0.6rem 0.8rem' }} onClick={() => { fetchNotesAndFolders() }}>
            <ReactSVG src={`/icons/refresh.svg`} className="icon" style={{ scale: 1.2 }} />
          </button>
          {/* if there's a selected folder, show the edit folder button */}
          {foldersContext?.selectedFolder && <button className="mainBtn w-full end gap-2" style={{ padding: '0.6rem 0.8rem', background: 'var(--Orange)' }} onClick={() => { setEditingFolder() }}>
            <ReactSVG src={`/icons/edit.svg`} className="icon" style={{ scale: 1.2 }} />
          </button>}
          <SearchBar />
        </AnimatedDiv>
      </div>
      {/* pinnedSection (show it only if there's at least one pinned note) */}
      {notesToShow.value.filter(note => note.pinned).length > 0 && (
        <NotesSection title="Pinned" notes={notesToShow.value.filter(note => note.pinned)} />
      )}

      {/* non-pinned notes section */}
      {notesToShow.value.length > 0 ? <NotesSection title="Others" notes={notesToShow.value.filter(note => !note.pinned)} /> : <div className="w-full h-full center">
        You haven't saved any notes yet
      </div>}
    </div>
  );
}
