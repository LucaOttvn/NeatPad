'use server'
import { supabase } from "@/utils/supabaseClient";
import { User } from "@supabase/supabase-js";

export async function getUserById(userId: number) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }

    return data;
}

export async function getUserByEmail(email: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }

    return data;
}

export async function updateUser(updatedUser: User) {

    const { data, error } = await supabase
        .from('users')
        .update(updatedUser)
        .eq('id', updatedUser.id)
        .select()
        .single()

    if (error) {
        console.error("Error updating user:", error);
        return null;
    }

    return data;
}

export async function deleteUser(id: number) {
    const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error deleting user:", error);
        return null;
    }

    return data;
}

export async function getUsersEmails() {
    const { data, error } = await supabase
        .from('users')
        .select('email');

    if (error) {
        console.error('Error fetching users:', error.message);
        return null;
    }

    const emails = data.map(item => {
        return item.email
    })

    return emails as string[]
}