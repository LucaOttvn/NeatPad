import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './noteEditorModalHeader.scss';
import SvgButton from '@/components/ui/SvgButton';
import { ReactSVG } from 'react-svg';
import { Note } from '@/utils/interfaces';

interface CollaboratorsSectionProps {
    collaboratorsSectionOpen: boolean
    note: Note | undefined
}

export default function CollaboratorsSection(props: CollaboratorsSectionProps) {

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

    const addCollaborator = () => {
        if (!props.note) return

        const collaborators = [...props.note.collaborators]
        console.log(collaborators)

        // collaborators.push(emailInputRef.current)

        // const updatedNote: Note = {...props.note, collaborators: [...props.note.collaborators, emailInputRef.current]}
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