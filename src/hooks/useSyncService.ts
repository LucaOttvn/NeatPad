"use client";;
import * as Diff3 from 'node-diff3';
import { createNote, deleteNote, getNote, getNotesByUserEmail, updateNote } from "@/serverActions/notesActions";
import { db } from "@/utils/db";
import { updateFolders, updateNotesToShow } from "@/utils/globalMethods";
import { Note } from "@/utils/interfaces";
import { user } from "@/utils/signals";
import { liveQuery } from "dexie";
import { useEffect } from "react";
import { processMergeResult } from '@/utils/diffingService';

// syncronization between local and remote db
export function useSyncService() {

    const handleNotesToSync = async () => {

        // get the local notes that need to sync
        const unsyncedNotes: (Note | undefined)[] = await db.notes.filter(note => note.synced === false).toArray();
        const unsyncedNoteIds: (number | undefined)[] = unsyncedNotes.map(note => note?.id);
        // get the base versions of the notes that need to be synced
        const baseVersions: (Note | undefined)[] = await db.notesBaseVersions.bulkGet(unsyncedNoteIds)
        // user.value will necessarily be not null since this method gets called in the notesOverview component that's accessible only if the user is logged in
        const remoteNotes: Note[] | undefined = user.value ? await getNotesByUserEmail(user.value.email) || [] : undefined

        if (!remoteNotes) return

        for (const unsyncedNote of unsyncedNotes) {

            if (!unsyncedNote || !unsyncedNote.id || !user.value) continue
            // if the note is new, it'll have title and text empty, in that case create a new one on the remote db, otherwise update the existing one
            if (unsyncedNote.title === '' && unsyncedNote.text === '') return await createNote(unsyncedNote)

            const remoteVersion = remoteNotes.find(remoteNote => remoteNote.id === unsyncedNote.id)
            const baseVersion: Note | undefined = baseVersions.find(note => note?.id === unsyncedNote.id)
            if (!baseVersion || !remoteVersion) continue

            console.log('base: ', baseVersion.text)
            console.log('remote: ', remoteVersion.text)
            console.log('latest: ', unsyncedNote.text)

            // if remote and base are the same, it means that the local base version is up to date with the db
            // in this case just update the remote note with the latest local version
            if (remoteVersion.text === baseVersion.text) {
                console.log('//// remote and base are the same')
                await updateNote({ ...unsyncedNote, last_update: new Date(), synced: true })
                await db.notesBaseVersions.update(baseVersion.id, { text: unsyncedNote.text })
                continue
            }
            // instead, if the remote version has been updated while the base local one hasn't, it means that the the merge has to happen
            const result = Diff3.diff3Merge(unsyncedNote.text, baseVersion.text, remoteVersion.text);
            const mergedText = processMergeResult(result as any);
            console.log('merged: ', mergedText)
            await updateNote({ ...unsyncedNote, text: mergedText, last_update: new Date(), synced: true })
            await db.notesBaseVersions.update(baseVersion.id, { text: mergedText })
        }

        // notes to delete handling
        const localNotesToDelete = await db.notesTombstones.toArray();

        for (const noteTombstone of localNotesToDelete) {
            const deletedNote = await deleteNote(noteTombstone.id);
            if (!deletedNote) continue
            // if the note has been successfully deleted, remove the tombstone
            await db.notesTombstones.delete(noteTombstone.id)
        }

        // at the end of the sync process, if there are some local notes that aren't in the remote db, remove them.
        // this is necessary because deleting one note from one device (and so from the remote) doesn't remove it from other devices' local dbs too
        const localNotes = await db.notes.toArray()
        let notesToDeleteLocally: number[] = []

        for (const localNote of localNotes) {
            if (!remoteNotes.some(remoteNote => remoteNote.id === localNote.id) && localNote.id) {
                notesToDeleteLocally.push(localNote.id)
            }
        }
        await db.notes.bulkDelete(notesToDeleteLocally)
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

        // listen for changes on folders
        liveQuery(() => db.folders.toArray()).subscribe({
            next: (result) => {
                updateFolders(result)
                // sync()
            },
            error: (error) => console.error("Error:", error),
        });

        // whenever the state goes from "offline" to "online", retrigger the sync
        window.addEventListener("online", handleNotesToSync);

        // initially, if the status is "online", sync with the db
        if (navigator.onLine) handleNotesToSync()

        return () => {
            window.removeEventListener("online", handleNotesToSync);
        };
    }, []);
}