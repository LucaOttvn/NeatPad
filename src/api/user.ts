import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js";

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    console.log(data);
    return data;
}


export async function getUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
}