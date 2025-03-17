import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js";

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}


export async function getUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
}