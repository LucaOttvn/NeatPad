import React, { Dispatch, SetStateAction } from 'react';
import './noteEditor.scss'

interface MarkdownToolbarProps {
    setUseMarkdown: Dispatch<SetStateAction<boolean>>
}

export default function MarkdownToolbar(props: MarkdownToolbarProps) {
    return (
        <div className='markdownToolbar'>
            <div className='useMarkdownToggle'>
                <div className='edit' onClick={() => {
                    props.setUseMarkdown(false)
                }}>Edit</div>
                <div className='view' onClick={() => {
                    props.setUseMarkdown(true)
                }}>View</div>
            </div>
        </div>
    );
}