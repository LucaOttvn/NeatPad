import { effect, signal } from "@preact/signals-react";
import { ModalsNames, Note, SideMenusNames } from "./interfaces";
import { updateNote } from "@/serverActions/notesActions";

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

effect(() => {
    console.log(notes.value)
})
export const notesToShow = signal<Note[]>([])