import { effect, signal } from "@preact/signals-react";
import { ModalsNames, Note, SideMenusNames } from "./interfaces";
import { updateNote } from "@/serverActions/notesActions";
import gsap from 'gsap'

export const selectedSideMenu = signal<SideMenusNames | undefined>();
export const selectedModal = signal<ModalsNames | undefined>();
export const isMobile = signal(false);
export const loading = signal(true);
export const notes = signal<Note[]>([])

export async function updateNoteState(note: Note) {
    notes.value = notes.value.map(el =>
        el.id === note.id
            ? note
            : el
    )
    await updateNote(note)
}

export const notesToShow = signal<Note[]>([])
export const notesToDelete = signal<number[]>([])
export const selectedNote = signal<number | undefined>()