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


export async function createNote(newNote: Note): Promise<Note|null> {
    const { data, error } = await supabase
      .from('notes')
      .insert([ newNote ])
      .select()
      .single();
  
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


export async function deleteNote(id: number) {
    // run the delete, then select the deleted row back
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .select()
      .single();
  
    if (error) {
      console.error("Error deleting note:", error);
      return null;
    }
  
    return data;
  }