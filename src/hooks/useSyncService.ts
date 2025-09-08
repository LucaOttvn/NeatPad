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

            console.log('base: ', baseVersion.text)
            console.log('remote: ', remoteVersion.text)
            console.log('latest: ', latestVersion.text)

            // if remote and base are the same, it means that the local base version is up to date with the db
            // in this case just update the remote note with the latest local version
            if (remoteVersion.text === baseVersion.text) {
                console.log('remote and base are the same'.toUpperCase())
                await updateNote({ ...latestVersion, last_update: new Date(), synced: true })
                await db.notesBaseVersions.update(baseVersion.id, { text: latestVersion.text })
                continue
            }
            // instead, if the remote version has been updated while the base local one hasn't, it means that the the merge has to happen
            const result = Diff3.diff3Merge(latestVersion.text, baseVersion.text, remoteVersion.text);
            const mergedText = processMergeResult(result as MergeRegion<string>[]);
            console.log('merged: ', mergedText);
            await updateNote({ ...latestVersion, text: mergedText, last_update: new Date(), synced: true })
            await db.notesBaseVersions.update(baseVersion.id, { text: mergedText })
        }

        // // if the note is new, it'll have title and text empty, in that case create a new one on the remote db, otherwise update the existing one
        // for (const note of unsyncedNotes) {
        //     if (note.title === '' && note.text === '') return await createNote(note)
        //     await updateNote(note)
        // }
    };

    // const processMergeResult = (mergeResult: Diff3.MergeRegion<unknown>[]) => {
    //     let finalString = '';

    //     mergeResult.forEach(hunk => {
    //         if (hunk.ok) {
    //             finalString += hunk.ok.join(' ') + ' ';
    //         } else if (hunk.conflict) {
    //             // Concatenate 'a' and 'b' to get both changes
    //             finalString += (hunk.conflict.a.join(' ') + ' ') + (hunk.conflict.b.join(' '));
    //         }
    //     });
    //     return finalString;
    // };

    type MergeRegion<T> =
        | { ok: T[]; conflict?: never }
        | { ok?: never; conflict: { a: T[]; aIndex: number; o: T[]; oIndex: number; b: T[]; bIndex: number } };

    // Build a simple mapping of “o token -> replacement tokens from b”
    // and any leading inserts in b that occur before the first o token.
    function mapBaseToRemoteReplacements(o: string[], b: string[]) {
        const repl = new Map<string, string[]>();
        const insertedBefore: string[] = [];

        let iO = 0;
        let iB = 0;

        // Gather b tokens before the first o match (global insert-before)
        while (iB < b.length && (iO >= o.length || b[iB] !== o[iO])) {
            // Look ahead: if the token exists later in o, stop collecting
            const nextInO = o.indexOf(b[iB], iO);
            if (nextInO !== -1) break;
            insertedBefore.push(b[iB]);
            iB++;
        }

        while (iO < o.length && iB < b.length) {
            if (o[iO] === b[iB]) {
                iO++; iB++;
                continue;
            }
            // Replacement of o[iO] by some run of b tokens until next o token
            const nextMatchInB = (() => {
                for (let j = iB; j < b.length; j++) {
                    if (j === iB) continue;
                    const kInO = o.indexOf(b[j], iO + 1);
                    if (kInO !== -1) return j;
                }
                return -1;
            })();

            const replacedBase = o[iO];
            const replacement = nextMatchInB === -1 ? b.slice(iB) : b.slice(iB, nextMatchInB);
            if (replacement.length) {
                // accumulate replacements per base token (handles multi-token replacements)
                const prev = repl.get(replacedBase) ?? [];
                repl.set(replacedBase, prev.concat(replacement));
            }
            iO += 1;
            iB = nextMatchInB === -1 ? b.length : nextMatchInB;
        }

        // Any trailing b tokens not aligned to o become appended inserts later
        const trailing = iB < b.length ? b.slice(iB) : [];

        return { repl, insertedBefore, trailing };
    }

    function combineConflict(o: string[], a: string[], b: string[]): string[] {
        const { repl, insertedBefore, trailing } = mapBaseToRemoteReplacements(o, b);

        const result: string[] = [];
        const insertedForBase = new Set<number>(); // guard against double insert per anchor in repeated tokens

        // Insert any global b-inserts that came before the first o alignment
        if (insertedBefore.length) result.push(...insertedBefore);

        for (let i = 0; i < a.length; i++) {
            const tok = a[i];
            result.push(tok);

            // If b replaced this base token, and local kept it, inject the remote replacement after it
            if (repl.has(tok)) {
                // To reduce duplicate injections on repeated tokens, only inject once per position
                if (!insertedForBase.has(i)) {
                    result.push(...(repl.get(tok) ?? []));
                    insertedForBase.add(i);
                }
            }
        }

        // If remote had trailing tokens not aligned to base, append them
        if (trailing.length) result.push(...trailing);

        // Best-effort dedupe of immediate repeats (optional)
        // return result.filter((t, idx, arr) => idx === 0 || arr[idx - 1] !== t);
        return result;
    }

    function processMergeResult(mergeResult: MergeRegion<string>[]) {
        const pieces: string[] = [];

        for (const hunk of mergeResult) {
            if ('ok' in hunk && hunk.ok) {
                pieces.push(...hunk.ok);
            } else if ('conflict' in hunk && hunk.conflict) {
                const { a, o, b } = hunk.conflict;
                // Combine both sides relative to base
                pieces.push(...combineConflict(o, a, b));
            }
        }
        return pieces.join(' ').trim();
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