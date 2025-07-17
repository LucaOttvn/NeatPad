import { supabase } from "./supabaseClient";

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

export async function getUserById(userId: number) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    console.log(data);
    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }

    return data;
}