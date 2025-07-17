import { User } from "@/utils/interfaces";
import { supabase } from "./supabaseClient";




// export async function getUser(): Promise<User | undefined> {
//     const { data, error } = await supabase.auth.getUser()
//     if (error) return undefined
//     return data.user
// }

export async function newSignIn(email: string, password: string) {
    email = 'testEnail'
    password = 'testPswd'
}

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

interface UpdateAuthUserParams {
    email?: string;
    password?: string;
}

export async function updateUser(updatedUserInfo: UpdateAuthUserParams) {

    const { data, error } = await supabase.auth.updateUser(updatedUserInfo);

    if (error) {
        console.error("Error updating user:", error);
        return null;
    }

    return data?.user || null;
}