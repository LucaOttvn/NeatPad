import { effect, signal } from "@preact/signals-react";
import { Folder, ModalsNames, Note, SideMenusNames, User } from "./interfaces";
import { updateNote } from "@/serverActions/notesActions";
import { updateFolder } from "@/serverActions/foldersActions";

export const selectedSideMenu = signal<SideMenusNames | undefined>();
export const selectedModal = signal<ModalsNames | undefined>();
export const isMobile = signal(false);
export const loading = signal(false);

// notes signals
export const notes = signal<Note[]>([])
export const notesToShow = signal<Note[]>([])
export const notesToDelete = signal<number[]>([])
export const selectedNote = signal<number | undefined>()

export async function updateNoteState(note: Note) {
    notes.value = notes.value.map(el =>
        el.id === note.id
            ? note
            : el
    )
    await updateNote(note)
}

// folders signals
export const folders = signal<Folder[]>([])
export const updatingFolder = signal<number | undefined>()
export const selectedFolder = signal<number | undefined>()

export async function updateFolder5tate(folder: Folder) {
    folders.value = folders.value.map(el =>
        el.id === folder.id
            ? folder
            : el
    )
    await updateFolder(folder)
}

export const user = signal<User | undefined>()

export const isAppInstallable = signal<any>()
export const alreadyInstalledApp = signal(false)