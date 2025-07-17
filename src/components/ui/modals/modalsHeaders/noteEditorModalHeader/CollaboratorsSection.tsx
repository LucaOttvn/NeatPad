import React, { Dispatch, SetStateAction, useEffect } from 'react';
import gsap from 'gsap'
import './noteEditorModalHeader.scss';

interface CollaboratorsSectionProps {
    collaboratorsSectionOpen: boolean
}

export default function CollaboratorsSection(props: CollaboratorsSectionProps) {

    useEffect(() => {
        gsap.to(".collaboratorsSection", {
            height: props.collaboratorsSectionOpen ? "auto" : 0,
            marginBottom: props.collaboratorsSectionOpen ? '1rem' : 0,
            duration: 0.2,
            ease: 'power4.out',
        });
    }, [props.collaboratorsSectionOpen])

    return (
        <section className="collaboratorsSection">
            <span className="font-bold mx-5 mt-5">Collaborators</span>
            <div className="collaboratorsList">
                {['test1@gmail.com', 'test2@gmail.com', 'test3@gmail.com', 'test4@gmail.com', 'test5@gmail.com', 'test6@gmail.com'].map((email) => {
                    return <div key={email} className="emailBox">
                        <span>{email}</span>
                    </div>
                })}
            </div>
            <div className="footer">ciao</div>
        </section>
    );
}