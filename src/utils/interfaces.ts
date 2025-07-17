export interface Note {
    id: number
    title: string
    text: string
    state: number
}

export enum ModalsNames {
    newNote = "newNoteModal",
    updateNote = "updateNoteModal",
    login = "login"
}