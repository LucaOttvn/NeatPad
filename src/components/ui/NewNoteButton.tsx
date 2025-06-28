import { useContext, useEffect } from 'react';
import Image from "next/image";
import { NotesContext } from '@/contexts/notesContext';
import { createNote, deleteNote } from '@/db/notes';
import { animateDivUnmount } from '@/utils/globalMethods';
import { Note, ModalsNames } from '@/utils/interfaces';
import { selectedModal } from '@/utils/signals';
import { flushSync } from 'react-dom';
import { UserContext } from '@/contexts/userContext';
import gsap from 'gsap';

interface NewNoteButtonProps { }

export default function NewNoteButton(props: NewNoteButtonProps) {

    const notesContext = useContext(NotesContext)
    const userContext = useContext(UserContext)

    // when the user clicks on the plus button, the createNote() gets triggered, this has to happen because the NoteEditor component needs a note with an already existing id since it's supposed to edit notes, not creating new ones
    async function openNewNoteModal() {
        const newNote: Note = {
            user: userContext!.user!.id!,
            title: '',
            text: '',
            last_update: new Date(),
            pinned: false,
            folder: null,
        }
        let newNoteFromDB = await createNote(newNote)
        if (newNoteFromDB) {
            if (!notesContext) return null
            let arr = [...notesContext.notes, newNoteFromDB]
            flushSync(() => {
                notesContext.setNotes(arr)
                notesContext.setSelectedNote(newNoteFromDB.id)
            })
            selectedModal.value = ModalsNames.newNote
        }
    }

    // delete mode animation for the add/delete note button
    useEffect(() => {
        gsap.to('#newNoteBtn', {
            rotateY: notesContext?.deleteMode.active ? '180deg' : '0deg',
            background: notesContext?.deleteMode.active ? 'var(--Red)' : '',
            duration: 0.2,
            onComplete: () => {
                gsap.to('#trashBtn', {
                    scale: notesContext?.deleteMode.active ? 1 : 0,
                    duration: 0.2
                })
                gsap.to('#plusBtn', {
                    scale: notesContext?.deleteMode.active ? 0 : 1,
                    duration: 0.2
                })
            }
        })
    }, [notesContext?.deleteMode.active]);

    return (
        <button
            id="newNoteBtn"
            className="addBtn"
            style={{ borderRadius: "50%" }}
            onClick={() => {
                if (notesContext?.deleteMode.active) {
                    let notesToDelete = notesContext.deleteMode.notes.map((noteId) => {
                        return 'noteCard' + noteId
                    })
                    animateDivUnmount(notesToDelete, () => {
                        let updatedNotes = notesContext.notes.filter(note => !notesContext.deleteMode.notes.includes(note.id!));
                        notesContext.setNotes(updatedNotes)
                        deleteNote(notesContext.deleteMode.notes)
                        notesContext.setDeleteMode({ active: false, notes: [] })
                    })
                }
                else {
                    openNewNoteModal()
                }
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
            <Image
                id="plusBtn"
                src="/icons/plus.svg"
                width={25}
                height={25}
                alt=""
                draggable={false}
            />
        </button>
    );
}