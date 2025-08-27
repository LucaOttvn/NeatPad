import { Dispatch, SetStateAction, useEffect } from 'react';
import './noteEditor.scss';
import gsap from 'gsap';

interface MarkdownToolbarProps {
    editMode: boolean
    seteditMode: Dispatch<SetStateAction<boolean>>
}

export default function MarkdownToolbar(props: MarkdownToolbarProps) {

    useEffect(() => {
        handleToggleMode(props.editMode)
    }, []);

    const handleToggleMode = (editMode: boolean) => {
        gsap.to('.view', {
            background: editMode ? 'var(--darkGrey)' : 'var(--Green)',
            color: editMode ? 'var(--White)' : 'var(--Black)',
            duration: 0.2,
            ease: 'power4.out'
        })
        gsap.to('.edit', {
            background: editMode ? 'var(--Green)' : 'var(--darkGrey)',
            color: editMode ? 'var(--Black)' : 'var(--White)',
            duration: 0.2,
            ease: 'power4.out'
        })
    }

    return (
        <div className='markdownToolbar'>
            <div className='editModeToggle'>
                <div className='edit' onClick={() => {
                    props.seteditMode(true)
                    handleToggleMode(true)
                }}>Edit</div>
                <div className='view' onClick={() => {
                    props.seteditMode(false)
                    handleToggleMode(false)
                }}>View</div>
            </div>
        </div>
    );
}