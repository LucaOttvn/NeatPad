'use server'

import { supabase } from "@/utils/supabaseClient";
import { Folder } from "@/utils/interfaces";

export async function getFoldersByUserId(userId: number) {

    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user', userId)
        .order('name', { ascending: true }); 

    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}

export async function createFolder(folder: Folder) {
    const { data, error } = await supabase
        .from("folders")
        .insert(folder)
        .select()
        .single();

    if (error) {
        console.error("Error inserting folder:", error);
        return null;
    }

    return data;
}


export async function updateFolder(
    id: number,
    updates: Partial<Folder>
) {
    const { data, error } = await supabase
        .from("folders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating folder:", error);
        return null;
    }

    return data;
}

export async function deleteFolder(id: number) {
    const { data, error } = await supabase
        .from("folders")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error deleting folder:", error);
        return null;
    }

    return data;
}
