import { useEffect } from 'react';
import Image from "next/image";
import { animateDivUnmount } from '@/utils/globalMethods';
import { Note, ModalsNames } from '@/utils/interfaces';
import { loading, notes, notesToDelete, selectedFolder, selectedModal, selectedNote, user } from '@/utils/signals';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { createNote, deleteNote } from '@/serverActions/notesActions';
import { db } from '@/utils/db';
import SvgButton from './SvgButton';
import { ReactSVG } from 'react-svg';

interface NewNoteButtonProps { }

export default function NewNoteButton(props: NewNoteButtonProps) {


    // when the user clicks on the plus button, the createNote() gets triggered, this has to happen because the NoteEditor component needs a note with an already existing id since it's supposed to edit notes, not creating new ones
    async function openNewNoteModal() {
        loading.value = true
        const newNote: Note = {
            user: user.value!.email,
            title: '',
            text: '',
            last_update: new Date(),
            pinned: false,
            folders: [],
            collaborators: []
        }

        if (selectedFolder.value) newNote.folders.push(selectedFolder.value)

        await db.notes.add(newNote)

        let newNoteFromDB = await createNote(newNote)
        if (newNoteFromDB) {
            notes.value = [...notes.value, newNoteFromDB]
            flushSync(() => {
                selectedNote.value = newNoteFromDB.id
            })
            selectedModal.value = ModalsNames.newNote
        }
        loading.value = false
    }

    // delete mode animation for the add/delete note button
    useEffect(() => {
        const deleteModeOn = notesToDelete.value.length > 0
        gsap.to('#newNoteBtn', {
            rotateY: deleteModeOn ? '180deg' : '0deg',
            background: deleteModeOn ? 'var(--Red)' : '',
            duration: 0.2,
            onComplete: () => {
                gsap.to('#trashBtn', {
                    scale: deleteModeOn ? 1 : 0,
                    duration: 0.2
                })
                gsap.to('#plusBtn', {
                    scale: deleteModeOn ? 0 : 1,
                    duration: 0.2
                })
            }
        })
    }, [notesToDelete.value]);

    return (
        <button
            id="newNoteBtn"
            className="addBtn"
            onClick={() => {
                // if delete mode is off
                if (notesToDelete.value.length == 0) {
                    return openNewNoteModal()
                }
                let notesTags = notesToDelete.value.map((noteId) => {
                    return 'noteCard' + noteId
                })
                animateDivUnmount(notesTags, () => {
                    notes.value = notes.value.filter(note => !notesToDelete.value.includes(note.id!));
                    deleteNote(notesToDelete.value)
                    notesToDelete.value = []
                })
            }}
        >
            <Image
                id="trashBtn"
                src="/icons/trash.svg"
                width={25}
                height={25}
                alt=""
                draggable={false}
            />
            {/* <Image
                id="plusBtn"
                src="/icons/plus.svg"
                width={25}
                height={25}
                alt=""
                draggable={false}
            /> */}
            <ReactSVG src={`/icons/plus.svg`} className="icon" beforeInjection={(svg) => {
                svg.setAttribute("fill", 'var(--White)');
            }} />
        </button>
    );
}