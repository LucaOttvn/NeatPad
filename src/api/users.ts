import { supabase } from "./supabaseClient";

export async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'lucatremila@gmail.com',
        password: 'example-password',
    })
    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    console.log(data);
    return data;
}


export async function getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) return error
    return data.user
}