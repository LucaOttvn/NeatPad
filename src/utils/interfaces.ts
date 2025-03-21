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
    login = "login"
}

export interface Folder {
    id?: number
    name: string
    color?: string
    notes: number[]
}