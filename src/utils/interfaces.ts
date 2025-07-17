export interface Note {
    id?: number
    title: string
    text: string
    state: number
    user: string
    last_update: Date
}

export enum ModalsNames {
    newNote = "newNoteModal",
    updateNote = "updateNoteModal",
    login = "login"
}