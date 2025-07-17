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
    "Pink",
    "FrenchPurple",
    "SlateRed",
    "Magenta",
    
    "Yellow",
    "Orange",
    "FlameRed",
    "Red",
    
    "Turquoise",
    "Green",
    "ShamrockGreen",
    "PersianGreen",
    
    "Cyan",
    "GreyishBlue",
    "SlateBlue",
    "Blue",
];