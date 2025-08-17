import { ModalsNames, Note } from "@/utils/interfaces";
import "./notesOverview.scss";
import { useEffect } from "react";
import AnimatedText from "../animatedComponents/AnimatedText";
import NotesSection from "../ui/NotesSection";
import { ReactSVG } from "react-svg";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
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

  // future local flow
  // if navigator.online => fetch notes
  // else => get local notes

  // const localNotes = useLiveQuery(() => db.notes.toArray()) || [];

  useEffect(() => {

    const fetchLocalNotes = async () => {
      const localNotes: Note[] = await db.notes.toArray();
      notes.value = localNotes
      notesToShow.value = localNotes
    };

    if (!navigator.onLine) {
      fetchLocalNotes();
      return
    }
    fetchNotesAndFolders();
  }, []);

  // listen for changes in the notes array or in the current folder
  useEffect(() => {

    notesToShow.value = notes.value

    // if there's a selected folder, filter the notes by it, otherwise show them all
    if (!selectedFolder.value) return
    const filteredNotes = notes.value.filter(note => note.folders.some(el => el == selectedFolder.value))
    if (filteredNotes) notesToShow.value = filteredNotes

  }, [selectedFolder.value, notes.value]);

  // get notes and folders
  async function fetchNotesAndFolders() {
    loading.value = true
    try {
      if (!user.value || !user.value.email) return

      const foundNotes = (await getNotesByUserEmail(user.value!.email)) || []
      const foundFolders = (await getFoldersByUserEmail(user.value!.email)) || []

      folders.value = foundFolders
      notes.value = foundNotes
      notesToShow.value = foundNotes
      // set the fetched notes to the local db
      await db.notes.bulkPut(foundNotes)
    } catch (err) {
      console.error("Error fetching initial data", err);
    } finally {
      loading.value = false
    }
  }

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
