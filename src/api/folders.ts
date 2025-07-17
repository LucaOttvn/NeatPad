import { Folder } from '@/utils/interfaces';
import { supabase } from './supabaseClient';


export async function getFolders(): Promise<Folder[] | null> {

    const { data, error } = await supabase
        .from('folders')
        .select('*')


    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}


export async function createFolder(folder: Folder) {

    const newFolder: Folder = {
        name: folder.name,
        notes: folder.notes,
        color: folder.color,
        user: folder.user
    }
    // Insert the new note into the "notes" table
    const { data, error } = await supabase
        .from('folders')
        .insert([
            newFolder
        ]);

    if (error) {
        console.error("Error inserting folder:", error);
        return null;
    }

    return data;
}