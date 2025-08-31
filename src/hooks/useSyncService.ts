"use client";;
import { createNote, deleteNote, updateNote } from "@/serverActions/notesActions";
import { db } from "@/utils/db";
import { updateFolders, updateNotesToShow } from "@/utils/globalMethods";
import { liveQuery } from "dexie";
import { useEffect } from "react";

// syncronization between local and remote db
export function useSyncService() {

    const sync = async () => {
        // get the local notes
        const localNotes = await db.notes.toArray()

        // get the local notes with synced == false
        const unsyncedNotes = localNotes.filter(note => note.synced == false)
        console.log('unsynced notes: ', unsyncedNotes)

        // if the note is new, it'll have title and text empty, in that case create a new one on the remote db, otherwise update the existing one
        for (const note of unsyncedNotes) {
            if (note.title === '' && note.text === '') return await createNote(note)
            await updateNote(note)
        }
    };

    const syncNotesToDelete = async () => {

        const localNotesToDelete = await db.notesTombstones.toArray();
        console.log('notes to delete: ', localNotesToDelete)

        for (const noteId of localNotesToDelete) {
            const deletedNote = await deleteNote(noteId.id);
            if (!deletedNote) return console.log(deletedNote)

            // FIX: THE SYNC SERVICE SHOULDNT MODIFY THE LOCAL STATE !!!!!!!!!!
            // await db.notesTombstones.delete(noteId.id)
            // await db.notes.delete(noteId.id)
        }
    }

    useEffect(() => {

        // listen for changes on notes
        liveQuery(() => db.notes.toArray()).subscribe({
            next: (result) => {
                updateNotesToShow(result)
                // sync()
            },
            error: (error) => console.error("Error:", error),
        });

        // listen for changes on notesTombstones
        liveQuery(() => db.notesTombstones.toArray()).subscribe({
            next: (result) => {
                // syncNotesToDelete()
            },
            error: (error) => console.error("Error:", error),
        });

        // listen for changes on folders
        liveQuery(() => db.folders.toArray()).subscribe({
            next: (result) => {
                updateFolders(result)
                // sync()
            },
            error: (error) => console.error("Error:", error),
        });

        // whenever the state goes from "offline" to "online", retrigger the sync
        window.addEventListener("online", sync);

        // initially, if the status is "online", sync with the db
        if (navigator.onLine) sync()

        return () => {
            window.removeEventListener("online", sync);
        };
    }, []);
}