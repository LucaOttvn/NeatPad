import { supabase } from "./supabaseClient";
import { getUserByEmail } from "./user";

export async function getTokenData(userEmail: string) {

    const user = await getUserByEmail(userEmail)

    const { data, error } = await supabase
        .from('resetPasswordTokens')
        .select('*, user(*)') // select all from resetPasswordTokens and all from related user
        .eq('user', user.id)
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

export async function deleteToken(token: string) {
    const { data, error } = await supabase
        .from("resetPasswordTokens")
        .delete()
        .eq("token", token)
        .select()
        .single();

    if (error) {
        console.error("Error deleting token:", error);
        return null;
    }

    return data;
}
