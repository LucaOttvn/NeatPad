import React, { Dispatch, SetStateAction } from 'react';
import './noteEditor.scss'

interface MarkdownToolbarProps {
    setUseMarkdown: Dispatch<SetStateAction<boolean>>
}

export default function MarkdownToolbar(props: MarkdownToolbarProps) {
    return (
        <div className='markdownToolbar'>
            <div className='useMarkdownToggle'>
                <div className='md' onClick={() => {
                    props.setUseMarkdown(true)
                }}>Markdown</div>
                <div className='txt' onClick={() => {
                    props.setUseMarkdown(false)
                }}>Text</div>
            </div>
        </div>
    );
}