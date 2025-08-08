'use server'
import { supabase } from "@/utils/supabaseClient";
import { isEncrypted } from "@/utils/globalMethods";
import { Note } from "@/utils/interfaces";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export async function encrypt(text: string) {
    const encryptionKeyHex = process.env.ENCRYPTION_KEY;

    if (!encryptionKeyHex) throw new Error('ENCRYPTION_KEY environment variable is not set!');

    const ENCRYPTION_KEY = Buffer.from(encryptionKeyHex, 'hex');
    const IV_LENGTH = 16;

    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

export async function decrypt(encryptedText: string) {
    const encryptionKeyHex = process.env.ENCRYPTION_KEY;

    if (!encryptionKeyHex) throw new Error('ENCRYPTION_KEY environment variable is not set!');

    const ENCRYPTION_KEY = Buffer.from(encryptionKeyHex, 'hex');
    const IV_LENGTH = 16;

    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedData = textParts.join(':');
    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted || '';
}

export async function createNote(note: Note) {

    const { data, error } = await supabase
        .from('notes')
        .insert([note])
        .select()
        .single();

    if (error) {
        console.error("Error inserting note:", error);
        return null;
    }

    return data;
}

export async function updateNote(note: Note) {

    // encrypt the note in the db
    let encryptedText = await encrypt(note.text)

    const lastUpdateNote: Note = { ...note, text: encryptedText, last_update: new Date() }

    const { data, error } = await supabase
        .from('notes')
        .update(lastUpdateNote)
        .eq('id', lastUpdateNote.id)
        .select()

    if (error) {
        console.error("Error updating note:", error);
        return null;
    }

    return data;
}

export async function getNotesByUserEmail(userEmail: string): Promise<Note[] | null> {
    const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .or(`user.eq.${userEmail},collaborators.cs.{${userEmail}}`) // check if user matches OR collaborators contains userEmail
        .order('last_update', { ascending: false });

    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    async function processNoteForDisplay(note: Note): Promise<Note> {
        return {
            ...note,
            text: isEncrypted(note.text) ? await decrypt(note.text) : note.text
        };
    }

    return Promise.all(notes.map(processNoteForDisplay));
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