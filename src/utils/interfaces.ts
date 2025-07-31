export interface Note {
    id?: number
    title: string
    text: string
    last_update: Date
    pinned: boolean
    folders: number[]
    user: number
    collaborators: string[]
}

export interface User {
    value: any
    id?: number
    email: string
    password: string
}

export interface Folder {
    id?: number
    name: string
    color?: string
    user: number
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

export const colors: {color: string, whiteText?: boolean}[] = [
    {
        color: "darkGrey",
        whiteText: true
    },
    {
        color: "White",
    },
    {
        color: "Pink",
    },
    {
        color: "SlateRed",
    },
    {
        color: "Purple",
    },
    {
        color: "Yellow",
    },
    {
        color: "Brown",
    },
    {
        color: "Orange",
    },
    {
        color: "Azure",
    },
    {
        color: "GreyishBlue",
    },
    {
        color: "Green",
    },
    {
        color: "Blue",
    },
    {
        color: "darkGreen",
        whiteText: true
    },
];