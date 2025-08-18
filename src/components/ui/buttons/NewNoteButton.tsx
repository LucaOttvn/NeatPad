import { useEffect } from 'react';
import Image from "next/image";
import { animateDivUnmount } from '@/utils/globalMethods';
import { Note, ModalsNames } from '@/utils/interfaces';
import { notes, notesToDelete, selectedFolder, selectedModal, selectedNote, user } from '@/utils/signals';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { createNote, deleteNote } from '@/serverActions/notesActions';
import { db } from '@/utils/db';
import './buttons.scss';

interface NewNoteButtonProps { }

export default function NewNoteButton(props: NewNoteButtonProps) {


    // when the user clicks on the plus button, the createNote() gets triggered, this has to happen because the NoteEditor component needs a note with an already existing id since it's supposed to edit notes, not creating new ones
    async function openNewNoteModal() {
        const newNote: Note = {
            user: user.value!.email,
            title: '',
            text: '',
            last_update: new Date(),
            pinned: false,
            folders: [],
            collaborators: []
        }

        // if a folder is currently selected while creating a note, pre-save the note with that folder by default
        if (selectedFolder.value) newNote.folders.push(selectedFolder.value)

        await db.notes.add(newNote)
        // selectedModal.value = ModalsNames.newNote

        // let newNoteFromDB = await createNote(newNote)
        // if (newNoteFromDB) {
        //     notes.value = [...notes.value, newNoteFromDB]
        //     flushSync(() => {
        //         selectedNote.value = newNoteFromDB.id
        //     })
        // }
    }

    // delete mode animation for the add/delete note button
    useEffect(() => {
        const deleteModeOn = notesToDelete.value.length > 0
        gsap.to('#newNoteButton', {
            rotateY: deleteModeOn ? '180deg' : '0deg',
            background: deleteModeOn ? 'var(--Red)' : '',
            duration: 0.2,
            onComplete: () => {
                gsap.to('#deleteNoteButtonIcon', {
                    scale: deleteModeOn ? 1 : 0,
                    duration: 0.2
                })
                gsap.to('#newNoteButtonIcon', {
                    scale: deleteModeOn ? 0 : 1,
                    duration: 0.2
                })
            }
        })
    }, [notesToDelete.value]);

    const handleNotesDelete = () => {
        let notesTags = notesToDelete.value.map((noteId) => 'noteCard' + noteId)
        animateDivUnmount(notesTags, () => {
            notes.value = notes.value.filter(note => !notesToDelete.value.includes(note.id!));
            db.notes.bulkDelete(notesToDelete.value)
            // deleteNote(notesToDelete.value)
            notesToDelete.value = []
        })
    }

    return (
        <button
            id="newNoteButton"
            className="newNoteButton"
            onClick={() => {
                // if delete mode is off
                if (notesToDelete.value.length == 0) {
                    return openNewNoteModal()
                }
                handleNotesDelete()
            }}
        >
            <Image
                id="deleteNoteButtonIcon"
                src="/icons/trash.svg"
                width={25}
                height={25}
                alt=""
                draggable={false}
            />
            <span className='font-bold' style={{ fontSize: 40, color: 'var(--lightBlack)' }}>+</span>
        </button>
    );
}