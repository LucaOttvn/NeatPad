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
