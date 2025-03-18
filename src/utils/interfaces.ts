export interface Note {
    id?: number
    title: string
    text: string
    state: number
    user: string
}

export enum ModalsNames {
    newNote = "newNoteModal",
    updateNote = "updateNoteModal",
    login = "login"
}