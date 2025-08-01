import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './noteEditorModalHeader.scss';
import SvgButton from '@/components/ui/SvgButton';
import { ReactSVG } from 'react-svg';
import { Note, User } from '@/utils/interfaces';
import { handleModal, validateEmail } from '@/utils/globalMethods';
import { notes, updateNoteState, user } from '@/utils/signals';
import { getUserByEmail, getUserById } from '@/serverActions/usersActions';

interface CollaboratorsSectionProps {
    collaboratorsSectionOpen: boolean
    note: Note | undefined
}

export default function CollaboratorsSection(props: CollaboratorsSectionProps) {

    const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
    const [noteOwnerEmail, setNoteOwnerEmail] = useState<string>('')
    const emailInputRef = useRef<HTMLInputElement>(null)

    const getNoteOwnerEmail = async () => {
        if (!props.note || !props.note.user) return
        const foundUser: User = await getUserById(props.note?.user)
        const isUserOwner = props.note?.user == user.value!.id
        const foundOwner = isUserOwner ? 'you' : foundUser.email
        setNoteOwnerEmail(foundOwner)
    }

    useEffect(() => {
        getNoteOwnerEmail()
    }, []);

    useEffect(() => {
        // open / close the collaborators section
        gsap.to(".collaboratorsSection", {
            height: props.collaboratorsSectionOpen ? "auto" : 0,
            marginBottom: props.collaboratorsSectionOpen ? '1rem' : 0,
            duration: 0.2,
            ease: 'power4.out',
        })
    }, [props.collaboratorsSectionOpen])

    const handleCollaboratorsSelection = (email: string) => {
        setSelectedCollaborators(prev => {
            const alreadySelectedEmail = prev.some(el => el === email);
            // if the email is already selected, remove it from the list 
            if (alreadySelectedEmail) return prev.filter(el => el !== email);
            // otherwise add it
            return [...prev, email];
        });
    }

    const addCollaborator = async () => {
        if (!props.note || !emailInputRef.current) return

        const inputValue = emailInputRef.current.value

        const emailValidation = validateEmail(inputValue)

        if (!emailValidation.isValid) return alert(emailValidation.error)

        const alreadyInsertedEmail = props.note.collaborators.some(item => item == inputValue)

        if (alreadyInsertedEmail) return alert(`${inputValue} is already a collaborator for this note`)

        const foundUser = await getUserByEmail(inputValue)

        if (!foundUser) return alert('No user found with this email')

        let updatedCollaborators = [...props.note.collaborators, inputValue]

        const updatedNote: Note = { ...props.note, collaborators: updatedCollaborators }

        await updateNoteState(updatedNote)

        emailInputRef.current.value = ''
    }

    const stopCollaborating = async () => {
        if (!props.note) return

        const collaborators = [...props.note?.collaborators]

        const updatedCollaborators = collaborators.filter(collaborator => collaborator != user.value!.email)

        const updatedNote = { ...props.note, collaborators: updatedCollaborators }

        await updateNoteState(updatedNote)

        // remove the note from the array of notesToShow
        notes.value = [...(notes.value || [])].filter(note => note.id != updatedNote.id)
        handleModal(undefined)
    }

    const deleteSelectedCollaborators = async () => {
        if (!props.note) return

        let collaborators = [...(props.note?.collaborators || [])]

        const updatedCollaborators = collaborators.filter(collaborator => !selectedCollaborators.some(el => el == collaborator))

        const note: Note = { ...props.note, collaborators: updatedCollaborators }

        await updateNoteState(note)

        setSelectedCollaborators([])
    }

    return (
        <section className="collaboratorsSection">
            {/* note owner section */}
            <div className='mt-5 pb-5' style={{ borderBottom: "solid 1px var(--Grey)" }}>
                <span className="font-bold mx-5" style={{ fontSize: '110%' }}>Note owner: {noteOwnerEmail}</span>
            </div>
            {/* collaborators section */}
            <div className='mt-5'>
                <span className="font-bold mx-5" style={{ fontSize: '110%' }}>Collaborators</span>
                <div className="collaboratorsList">
                    {props.note?.collaborators.map((email) => {
                        return <div key={email} className="emailBox" style={{ border: selectedCollaborators.some(el => el == email) ? 'solid 2px var(--Red)' : '' }} onClick={() => {
                            handleCollaboratorsSelection(email)
                        }}>
                            <span>{user.value!.email == email ? 'You' : email}</span>
                        </div>
                    })}

                    {props.note?.collaborators.length == 0 && <span style={{ color: 'var(--Grey)' }}>There are no collaborators</span>}

                    {user.value!.id == props.note?.user && <button className="trashBtn" disabled={selectedCollaborators.length == 0} onClick={() => {
                        deleteSelectedCollaborators()
                    }}>
                        <ReactSVG src={`/icons/trash.svg`} className="icon" />
                    </button>}
                </div>
            </div>
            {/* footer section */}
            <div className="footer">
                {/* if user is the note's owner */}
                {user.value!.id == props.note?.user && <>
                    <span className="font-bold" style={{ fontSize: '110%' }}>Add collaborator</span>
                    <div className='newCollaboratorEmailSection'>
                        <input className='newCollaboratorEmailInput' ref={emailInputRef} type="email" placeholder='Insert email' />
                        <SvgButton fileName='check' onClick={() => {
                            addCollaborator()
                        }} color='Green' />
                    </div>
                </>}
                {/* if user is a collaborator */}
                {user.value!.id != props.note?.user && <button className='mainBtn' style={{ background: 'var(--Red)', marginInline: 'auto' }} onClick={() => {
                    stopCollaborating()
                }}>Stop collaborating</button>}
            </div>
        </section>
    );
}