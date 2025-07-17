import { Note } from '@/utils/interfaces';
import { supabase } from './supabaseClient';


export async function getNotesByUserEmail(userId: number, userEmail: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .or(`user.eq.${userId},collaborators.cs.{${userEmail}}`) // check if user matches OR collaborators contains userEmail
    .order('last_update', { ascending: false });

    console.log(data)

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}

export async function createNote(newNote: Note){

  const { data, error } = await supabase
    .from('notes')
    .insert([newNote])
    .select()
    .single();

  if (error) {
    console.error("Error inserting note:", error);
    return null;
  }

  return data;
}

export async function updateNote(note: Note) {
  
  const { data, error } = await supabase
    .from('notes')
    .update(note)
    .eq('id', note.id)
    .select()

  if (error) {
    console.error("Error updating note:", error);
    return null;
  }

  return data;
}


export async function deleteNote(
  idOrIds: number | number[]
): Promise<Note | Note[] | null> {

  let query = supabase.from("notes").delete();

  // if it's an array, use .in; otherwise use .eq()
  if (Array.isArray(idOrIds)) {
    query = query.in("id", idOrIds);
  } else {
    query = query.eq("id", idOrIds);
  }

  // select the deleted rows
  // - .single() only for single-id deletes
  const { data, error } = Array.isArray(idOrIds)
    ? await query.select()     // returns Note[]
    : await query.select().single(); // returns Note

  if (error) {
    console.error("Error deleting note(s):", error);
    return null;
  }

  return data;
}