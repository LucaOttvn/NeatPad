import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useEffect } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import NotesSection from "../ui/NotesSection";
import { ReactSVG } from "react-svg";
import { folders, loading, notes, notesToShow, selectedFolder, selectedModal, updatingFolder, user } from "@/utils/signals";
import SearchBar from "../ui/searchBar/SearchBar";
import { getNotesByUserEmail } from "@/serverActions/notesActions";
import { db } from "@/utils/db";
import { getFoldersByUserEmail } from "@/serverActions/foldersActions";

export default function NotesOverview() {

  // if there's a selected folder set it
  const foundSelectedFolderData = selectedFolder.value ? folders.value.find(
    (el) => el.id == selectedFolder.value
  ) : undefined;

  const fetchLocalData = async () => {
    const [localFolders, localNotes] = await Promise.all([
      db.folders.toArray(),
      db.notes.toArray(),
    ]);

    folders.value = localFolders;
    // notes.value = localNotes;
    notesToShow.value = localNotes;
  };

  const fetchData = async () => {
    if (!user.value?.email) return;

    loading.value = true;
    try {
      const [foundNotes, foundFolders] = await Promise.all([
        getNotesByUserEmail(user.value.email),
        getFoldersByUserEmail(user.value.email),
      ]);

      if (!foundNotes) return console.error('Error fetching notes')

      // add the synced flag to each note and set it to true since they're just been fetched from the db
      const notesWithSyncedFlag: Note[] = foundNotes.map(note => ({...note, synced: true}))

      folders.value = foundFolders || [];
      // notes.value = notesWithSyncedFlag || [];
      notesToShow.value = notesWithSyncedFlag || [];

      await Promise.all([
        db.notes.bulkPut(notesWithSyncedFlag),
        db.folders.bulkPut(folders.value),
      ]);
    } catch (err) {
      console.error("Error fetching initial data", err);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    if (navigator.onLine) {
      fetchData();
      return
    }
    // fetchLocalData();  
  }, []);

  function setEditingFolder() {
    updatingFolder.value = selectedFolder.value
    selectedModal.value = ModalsNames.folderHandler
  }

  return (
    <div className="notesOverviewContainer">
      {/* title & search section */}
      <header>
        <SearchBar />
        {selectedFolder.value ? <AnimatedText className="title" text={foundSelectedFolderData?.name.toUpperCase() || ''} color={foundSelectedFolderData?.color} /> :
          <AnimatedText className="title" text="My notes" />
        }

        {/* <button className="mainBtn w-full end gap-2" style={{ padding: '0.6rem 0.8rem' }} onClick={() => { fetchNotesAndFolders() }}>
            <ReactSVG src={`/icons/refresh.svg`} className="icon" style={{ scale: 1.2 }} />
          </button> */}
        {/* if there's a selected folder, show the edit folder button */}
        {selectedFolder.value && <button className="mainBtn w-full end gap-2" style={{ padding: '0.6rem 0.8rem', background: 'var(--Orange)' }} onClick={() => { setEditingFolder() }}>
          <ReactSVG src={`/icons/edit.svg`} className="icon" style={{ scale: 1.2 }} />
        </button>}
      </header>
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
