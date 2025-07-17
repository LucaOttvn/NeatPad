import React, { Dispatch, SetStateAction, useEffect } from 'react';
import gsap from 'gsap'
import './noteEditorHeader.scss';
import SvgButton from '@/components/ui/SvgButton';

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
            <span className="w-full start font-bold px-5 pt-5">Collaborators</span>
            <div className="collaboratorsList">
                {['test1@gmail.com', 'test2@gmail.com', 'test3@gmail.com', 'test4@gmail.com', 'test5@gmail.com', 'test6@gmail.com'].map((email) => {
                    return <div key={email} className="emailBox">
                        <span>{email}</span>
                    </div>
                })}
            </div>
            <div className="footer">
                <SvgButton
                    fileName="trash"
                    onClick={() => {

                    }}
                />
                <SvgButton
                    fileName="plus"
                    onClick={() => {

                    }}
                />
            </div>
        </section>
    );
}