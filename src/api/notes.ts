import { Note } from '@/utils/interfaces';
import { supabase } from './supabaseClient';


export async function getNotes(): Promise<Note[] | null> {

    const { data, error } = await supabase
        .from('notes')
        .select('*');

    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}


export async function createNote(userId: string) {

    const note: Note = {
        title: 'Test insert 2',
        text: 'Test txt 2',
        state: 0,
        user: userId
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

    console.log("New note added:", data);
    return data;
}

export async function updateNote(userId: string) {
}