import { db } from '@/utils/db';
import { Note } from '@/utils/interfaces';
import { selectedNote } from '@/utils/signals';
import { useState, useEffect } from 'react';

// selectedNote.value (signals.ts) is a numeric id (the one of the selected folder)
// some components need to get the whole note from that id
// to avoid repeating this find process through the id, i created this hook
export function useGetCurrentNote(): [Note | undefined, React.Dispatch<React.SetStateAction<Note | undefined>>] {
    const [note, setNote] = useState<Note | undefined>(undefined);

    const getCurrentNote = async (): Promise<Note | undefined> => {
        const localNotes = await db.notes.toArray()
        const foundCurrentNote = localNotes.find((el) => el.id === selectedNote.value)
        if (!foundCurrentNote) return
        return foundCurrentNote
    }

    useEffect(() => {
        const findNote = async () => {
            const currentNote: Note | undefined = await getCurrentNote();
            if (!currentNote) return
            setNote(currentNote);
        };
        findNote();
    }, []);

    return [note, setNote];
}
