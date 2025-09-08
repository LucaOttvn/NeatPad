"use client";
import * as Diff3 from 'node-diff3'
import { createNote, deleteNote, getNote, updateNote } from "@/serverActions/notesActions";
import { db } from "@/utils/db";
import { updateFolders, updateNotesToShow } from "@/utils/globalMethods";
import { Note } from "@/utils/interfaces";
import { user } from "@/utils/signals";
import { liveQuery } from "dexie";
import { useEffect } from "react";

// syncronization between local and remote db
export function useSyncService() {

    const sync = async () => {

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
            const result = Diff3.diff3Merge(latestVersion.text, baseVersion.text, remoteVersion.text);
            const mergedText = processMergeResult(result);
            console.log(baseVersion)
            console.log(remoteVersion)
            console.log(latestVersion)
            console.log(mergedText);
            await updateNote({...latestVersion, text: mergedText})
        }

        // // if the note is new, it'll have title and text empty, in that case create a new one on the remote db, otherwise update the existing one
        // for (const note of unsyncedNotes) {
        //     if (note.title === '' && note.text === '') return await createNote(note)
        //     await updateNote(note)
        // }
    };

    const processMergeResult = (mergeResult: Diff3.MergeRegion<unknown>[]) => {
        let finalString = '';

        mergeResult.forEach(hunk => {
            if (hunk.ok) {
                finalString += hunk.ok.join(' ') + ' ';
            } else if (hunk.conflict) {
                // Concatenate 'a' and 'b' to get both changes
                finalString += (hunk.conflict.a.join(' ') + ' ') + (hunk.conflict.b.join(' ') + ' ');
            }
        });

        return finalString;
    };

    const str = ['a', 'b', 'c', 'd', 'd', 'e', 'f', 'g', 'h']


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
                sync()
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