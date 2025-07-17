export interface Note {
    id?: number
    title: string
    text: string
    state: number
    user: string
    last_update: Date
    pinned: boolean
}

export enum ModalsNames {
    newNote = "newNoteModal",
    updateNote = "updateNoteModal",
    login = "login",
    createFolder = "createFolderModal"
}

export interface Folder {
    id?: number
    name: string
    color?: string
    notes: number[]
    user: string
}

export const colors = [
    "Orange",
    "Red",
    "Yellow",
    "Blue",
    "Purple",
    "Brown",
    "Green",
];