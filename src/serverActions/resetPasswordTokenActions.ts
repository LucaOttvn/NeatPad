'use server'

import { supabase } from "@/utils/supabaseClient";

export async function getTokenData(token: string) {

    const { data, error } = await supabase
        .from('resetPasswordTokens')
        .select('*, user(*)') // select all from resetPasswordTokens and all from related user
        .eq('token', token)
        .single()

    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    return data;
}

export async function saveToken(token: string, userId: number) {
    
    const now = new Date();
    const sixMinutesLater = new Date(now.getTime() + (6 * 60 * 1000));
    
    let newToken = {
        user: userId,
        token: token,
        expiresAt: sixMinutesLater
    }
    
    const { data, error } = await supabase
        .from('resetPasswordTokens')
        .insert(newToken)
        .select()
        .single();

    if (error) {
        console.error("Error saving token:", error);
        return null;
    }

    return data;
}

export async function deleteToken(userEmail: string) {
    const { data, error } = await supabase
        .from("resetPasswordTokens")
        .delete()
        .eq("user", userEmail)
        .select()
        .single();

    if (error) {
        console.error("Error deleting token:", error);
        return null;
    }

    return data;
}