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
