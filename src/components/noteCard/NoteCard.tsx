import { Note } from '@/utils/interfaces';
import React from 'react';
import './noteCard.scss'

interface NoteCardProps {
    note: Note
}

export default function NoteCard(props: NoteCardProps) {
  return (
    <div className='noteCard'>
        <h1 className='title'>{props.note.title}</h1>
        <span>{props.note.text}</span>
    </div>
  );
}