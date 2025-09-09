import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import AnimatedText from "../animatedComponents/AnimatedText";
import NotesSection from "../ui/NotesSection";
import { ReactSVG } from "react-svg";
import {
  foldersToShow,
  loading,
  notesToShow,
  selectedFolder,
  selectedModal,
  updatingFolder,
  user,
} from "@/utils/signals";
import SearchBar from "../ui/searchBar/SearchBar";
import { getNotesByUserEmail } from "@/serverActions/notesActions";
import { db } from "@/utils/db";
import { getFoldersByUserEmail } from "@/serverActions/foldersActions";
import { updateFolders, updateNotesToShow } from "@/utils/globalMethods";
import { useAppForeground } from "@/hooks/useAppForeground";

/**
 * This component contains the list of user's notes.  
 * Every time that the user focuses on the app, a refetch of the notes is triggered.  
 * This behaviour ensures that even if the app is left in background for a while and then focused again, the user is likely to have the latest version of the notes.  
 * The "is likely" is because the system can't ensure that even if the user just fetched the data onFocus, some other user is updating a note shared with them.  
 * In that case the current user could locally have an outdated version of the note compared to the other collaborator.  
 * For that scenario the useSyncService will handle the diffing/merging of the note.  
 */
export default function NotesOverview() {

  // if there's a selected folder set it
  const foundSelectedFolderData = selectedFolder.value ? foldersToShow.value.find(
    (el) => el.id == selectedFolder.value
  ) : undefined;

  // whenever the user focuses the app, refetch data
  useAppForeground(() => {
    if (navigator.onLine) {
      fetchData();
      return
    }
    fetchLocalData();
  });

  const fetchLocalData = async () => {
    const [localFolders, localNotes] = await Promise.all([
      db.folders.toArray(),
      db.notes.toArray(),
    ]);

    updateFolders(localFolders)
    updateNotesToShow(localNotes)
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
      const notesWithSyncedFlag: Note[] = foundNotes.map(note => ({ ...note, synced: true }))

      foldersToShow.value = foundFolders || [];
      // notes.value = notesWithSyncedFlag || [];
      notesToShow.value = notesWithSyncedFlag || [];

      await Promise.all([
        db.notes.bulkPut(notesWithSyncedFlag),
        db.folders.bulkPut(foldersToShow.value),
      ]);
    } catch (err) {
      console.error("Error fetching initial data", err);
    } finally {
      loading.value = false;
    }
  };

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
