import { useEffect, useState } from 'react';
import gsap from 'gsap';
import './noteEditorModalHeader.scss';
import SvgButton from '@/components/ui/SvgButton';
import { ReactSVG } from 'react-svg';

interface CollaboratorsSectionProps {
    collaboratorsSectionOpen: boolean
}

enum CollaboratorModes {
    delete = 'delete',
    add = 'delete'
}

const collaborators = ['test1@gmail.com', 'test2@gmail.com', 'test3@gmail.com', 'test4@gmail.com', 'test5@gmail.com', 'test6@gmail.com']

export default function CollaboratorsSection(props: CollaboratorsSectionProps) {

    const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])

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

    return (
        <section className="collaboratorsSection">
            <span className="font-bold mx-5 mt-5" style={{ fontSize: '110%' }}>Collaborators</span>
            <div className="collaboratorsList">
                {collaborators.map((email) => {
                    return <div key={email} className="emailBox" style={{ border: selectedCollaborators.some(el => el == email) ? 'solid 2px var(--Red)' : '' }} onClick={() => {
                        handleCollaboratorsSelection(email)
                    }}>
                        <span>{email}</span>
                    </div>
                })}

                <button className="trashBtn" disabled={selectedCollaborators.length == 0}>
                    <ReactSVG src={`/icons/trash.svg`} className="icon" />
                </button>
            </div>
            <div className="footer">
                <span className="font-bold" style={{ fontSize: '110%' }}>Add collaborator</span>
                <div className='newCollaboratorEmailSection'>
                    <input className='newCollaboratorEmailInput' type="email" placeholder='Insert email' />
                    <SvgButton fileName='check' onClick={() => { }} color='Green' />
                </div>
            </div>
        </section>
    );
}