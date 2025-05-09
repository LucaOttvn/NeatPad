export interface Note {
    id?: number
    title: string
    text: string
    user: string
    last_update: Date
    pinned: boolean
    folder?: number
}

export enum ModalsNames {
    newNote = "newNoteModal",
    updateNote = "updateNoteModal",
    login = "login",
    folderHandler = "folderHandlerModal",
}
export enum SideMenusNames {
    folders = "foldersSideMenu",
}

export interface Folder {
    id?: number
    name: string
    color?: string
    user: string
}

export const colors = [
    {
        color: "White",
        text: 'Black'
    },
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