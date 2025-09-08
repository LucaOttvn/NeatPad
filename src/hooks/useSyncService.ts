"use client";
import * as Diff3 from 'node-diff3';
import { deleteNote, getNote, updateNote } from "@/serverActions/notesActions";
import { db } from "@/utils/db";
import { updateFolders, updateNotesToShow } from "@/utils/globalMethods";
import { Note } from "@/utils/interfaces";
import { user } from "@/utils/signals";
import { liveQuery } from "dexie";
import { useEffect } from "react";

// syncronization between local and remote db
export function useSyncService() {

    const handleNotesToSync = async () => {

        // get the local notes that need to sync
        const unsyncedNotes: (Note | undefined)[] = await db.notes.filter(note => note.synced === false).toArray();
        const unsyncedNoteIds: (number | undefined)[] = unsyncedNotes.map(note => note?.id);
        // get the base versions of the notes that need to be synced
        const baseVersions: (Note | undefined)[] = await db.notesBaseVersions.bulkGet(unsyncedNoteIds);

        // for each note to sync compare its current latest version, the initial local and the remote one
        for (const baseVersion of baseVersions) {
            if (!baseVersion || !baseVersion.id || !user.value) continue
            const remoteVersion = await getNote(user.value.email, baseVersion.id)
            const latestVersion = unsyncedNotes.find(note => note?.id === baseVersion.id)
            if (!latestVersion || !remoteVersion) continue

            console.log('base: ', baseVersion.text)
            console.log('remote: ', remoteVersion.text)
            console.log('latest: ', latestVersion.text)

            // if remote and base are the same, it means that the local base version is up to date with the db
            // in this case just update the remote note with the latest local version
            if (remoteVersion.text === baseVersion.text) {
                console.log('//// remote and base are the same')
                await updateNote({ ...latestVersion, last_update: new Date(), synced: true })
                await db.notesBaseVersions.update(baseVersion.id, { text: latestVersion.text })
                continue
            }
            // instead, if the remote version has been updated while the base local one hasn't, it means that the the merge has to happen
            const result = Diff3.diff3Merge(latestVersion.text, baseVersion.text, remoteVersion.text);
            const mergedText = processMergeResult(result as MergeRegion<string>[]);
            await updateNote({ ...latestVersion, text: mergedText, last_update: new Date(), synced: true })
            await db.notesBaseVersions.update(baseVersion.id, { text: mergedText })
        }

        // // if the note is new, it'll have title and text empty, in that case create a new one on the remote db, otherwise update the existing one
        // for (const note of unsyncedNotes) {
        //     if (note.title === '' && note.text === '') return await createNote(note)
        //     await updateNote(note)
        // }
    }

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
                handleNotesToSync()
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