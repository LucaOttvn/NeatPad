export interface Note {
    id?: number
    title: string
    text: string
    last_update: Date
    pinned: boolean
    folder: number | null
    user: number
    collaborators: number[]
}

export interface User {
    id?: number
    email: string
    password: string
}

export enum ModalsNames {
    newNote = "newNoteModal",
    updateNote = "updateNoteModal",
    login = "loginModal",
    createAccount = "createAccountModal",
    folderHandler = "folderHandlerModal",
    settings = "settingsModal",
}

interface Modal {
    name: string
    width: string
    height: string
    maxWidth: string
}

export const modalsList: Modal[] = [
    {
        name: ModalsNames.newNote,
        width: '80%',
        height: '80%',
        maxWidth: ''
    },
    {
        name: ModalsNames.updateNote,
        width: '80%',
        height: '80%',
        maxWidth: ''
    },
    {
        name: ModalsNames.login,
        width: '30%',
        height: 'auto',
        maxWidth: '355px'
    },
    {
        name: ModalsNames.createAccount,
        width: '30%',
        height: 'auto',
        maxWidth: '400px'
    },
    {
        name: ModalsNames.folderHandler,
        width: '70%',
        height: '65%',
        maxWidth: '700px'
    },
    {
        name: ModalsNames.settings,
        width: '60%',
        height: '90%',
        maxWidth: '600px'
    },
]

export enum SideMenusNames {
    folders = "foldersSideMenu",
}

export interface Folder {
    id?: number
    name: string
    color?: string
    user: number
}

export const colors = [
    {
        color: "White",
        text: 'Black'
    },
    {
        color: "darkGrey",
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