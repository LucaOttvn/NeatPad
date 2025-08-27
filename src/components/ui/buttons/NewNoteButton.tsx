import { useEffect } from 'react';
import Image from "next/image";
import { animateDivUnmount } from '@/utils/globalMethods';
import { Note, ModalsNames, Tombstone } from '@/utils/interfaces';
import { notesToDelete, selectedFolder, selectedModal, selectedNote, user } from '@/utils/signals';
import gsap from 'gsap';
import { db } from '@/utils/db';
import './buttons.scss';


/**
 *  based on the current mode, this component serves different purposes  
 when the delete mode is off, it creates a new note onClick  
 when the delete mode is on, it deletes all the selected notes  
 */
export default function NewNoteButton() {

    // when the user clicks on the plus button, the createNote() gets triggered
    // this has to happen because the NoteEditor component needs a note with an already existing id since it's supposed to edit notes, not creating new ones
    async function openNewNoteModal() {
        const newNote: Note = {
            user: user.value!.email,
            title: '',
            text: '',
            last_update: new Date(),
            pinned: false,
            folders: [],
            collaborators: [],
            synced: false
        }

        // if a folder is currently selected while creating a note, pre-save the note with that folder by default
        if (selectedFolder.value) newNote.folders.push(selectedFolder.value)

        await db.notes.add(newNote)

        selectedNote.value = newNote.id
        selectedModal.value = ModalsNames.newNote
    }

    // delete mode rotation animation for the button
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

    const handleClick = () => {
        // if delete mode is off
        if (notesToDelete.value.length == 0) return openNewNoteModal()

        // if delete mode is on, delete the selected notes
        let notesTags = notesToDelete.value.map((noteId) => 'noteCard' + noteId)

        animateDivUnmount(notesTags, async () => {
            const newTombstones: Tombstone[] = notesToDelete.value.map(id => ({ id: id }))
            await db.notesTombstones.bulkPut(newTombstones)
            await db.notes.bulkDelete(notesToDelete.value)
            notesToDelete.value = []
        })
    }

    return (
        <button
            id="newNoteButton"
            className="newNoteButton"
            onClick={handleClick}
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