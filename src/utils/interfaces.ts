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
    {
        color: "lightBlack",
        text: 'White'
    },
    {
        color: "Pink",
        text: 'Black'
    },
    {
        color: "FrenchPurple",
        text: 'Black'
    },
    {
        color: "SlateRed",
        text: 'Black'
    },
    {
        color: "Magenta",
        text: 'White'
    },
    {
        color: "Yellow",
        text: 'Black'
    },
    {
        color: "Orange",
        text: 'Black'
    },
    {
        color: "FlameRed",
        text: 'Black'
    },
    {
        color: "Red",
        text: 'White'
    },
    {
        color: "Turquoise",
        text: 'Black'
    },
    {
        color: "Green",
        text: 'Black'
    },
    {
        color: "ShamrockGreen",
        text: 'Black'
    },
    {
        color: "PersianGreen",
        text: 'Black'
    },
    {
        color: "Cyan",
        text: 'Black'
    },
    {
        color: "GreyishBlue",
        text: 'Black'
    },
    {
        color: "SlateBlue",
        text: 'Black'
    },
    {
        color: "Blue",
        text: 'Black'
    },
];