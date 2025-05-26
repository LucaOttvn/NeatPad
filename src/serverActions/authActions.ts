'use server'

import { supabase } from "@/api/supabaseClient";

export async function deleteSupabaseUser(userId: string) {
    try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) {
            console.error('Error deleting user:', error);
            return { error: error.message };
        }
        return { data: `User ${userId} deleted successfully` };
    } catch (error) {
        console.error('Server error during delete:', error);
        return { error: 'Internal Server Error' };
    }
}