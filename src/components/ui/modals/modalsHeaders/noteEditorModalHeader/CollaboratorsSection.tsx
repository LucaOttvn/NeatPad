import { useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './noteEditorModalHeader.scss';
import SvgButton from '@/components/ui/SvgButton';
import { ReactSVG } from 'react-svg';
import { Note } from '@/utils/interfaces';
import { validateEmail } from '@/utils/globalMethods';
import { getUserByEmail } from '@/db/user';
import { NotesContext } from '@/contexts/notesContext';

interface CollaboratorsSectionProps {
    collaboratorsSectionOpen: boolean
    note: Note | undefined
}

export default function CollaboratorsSection(props: CollaboratorsSectionProps) {

    const notesContext = useContext(NotesContext)
    const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
    const emailInputRef = useRef(null)

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

        const inputValue = (emailInputRef.current as HTMLInputElement).value

        const emailValidation = validateEmail(inputValue)

        if (!emailValidation.isValid) return alert(emailValidation.error)

        const alreadyInsertedEmail = props.note.collaborators.some(item => item == inputValue)
        
        if (alreadyInsertedEmail) return alert(`${inputValue} is already a collaborator for this note`)

        const foundUser = await getUserByEmail(inputValue)

        if (!foundUser) return alert('No user found with this email')

        let updatedCollaborators = [...props.note.collaborators, inputValue]

        const updatedNote: Note = { ...props.note, collaborators: updatedCollaborators }

        notesContext?.updateNoteState(updatedNote)
    }

    return (
        <section className="collaboratorsSection">
            <span className="font-bold mx-5 mt-5" style={{ fontSize: '110%' }}>Collaborators</span>
            <div className="collaboratorsList">
                {props.note?.collaborators.map((email) => {
                    return <div key={email} className="emailBox" style={{ border: selectedCollaborators.some(el => el == email) ? 'solid 2px var(--Red)' : '' }} onClick={() => {
                        handleCollaboratorsSelection(email)
                    }}>
                        <span>{email}</span>
                    </div>
                })}

                {props.note?.collaborators.length == 0 && <span style={{ color: 'var(--Grey)' }}>There are no collaborators</span>}

                <button className="trashBtn" disabled={selectedCollaborators.length == 0}>
                    <ReactSVG src={`/icons/trash.svg`} className="icon" />
                </button>
            </div>
            <div className="footer">
                <span className="font-bold" style={{ fontSize: '110%' }}>Add collaborator</span>
                <div className='newCollaboratorEmailSection'>
                    <input className='newCollaboratorEmailInput' ref={emailInputRef} type="email" placeholder='Insert email' />
                    <SvgButton fileName='check' onClick={() => {
                        addCollaborator()
                    }} color='Green' />
                </div>
            </div>
        </section>
    );
}