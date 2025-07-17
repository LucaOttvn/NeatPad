import { Note } from '@/utils/interfaces';
import { supabase } from './supabaseClient';


export async function getNotes(): Promise<Note[] | null> {

    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('last_update', { ascending: false }); // Sort by latest first


    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}


export async function createNote(userId: string) {

    const note: Note = {
        title: 'New',
        text: 'New',
        state: 0,
        user: userId,
        last_update: new Date(),
        pinned: false
    }
    // Insert the new note into the "notes" table
    const { data, error } = await supabase
        .from('notes')
        .insert([
            note
        ]);

    if (error) {
        console.error("Error inserting note:", error);
        return null;
    }

    return data;
}

export async function updateNote(updatedNote: Note) {

    const { data, error } = await supabase
        .from('notes')
        .update(updatedNote)
        .eq('id', updatedNote.id)

    if (error) {
        console.error("Error updating note:", error);
        return null;
    }

    return data;
}