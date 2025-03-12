import { supabase } from './supabaseClient';


export async function login() {

    const { data, error } = await supabase.auth.signInWithPassword
    ({
        email: 'lucatremila@gmail.com',
        password: 'example-password',
    })
    console.log(data)
}

export async function fetchData() {
    console.log("Fetching data...");

    const { data, error } = await supabase
        .from('notes')
        .select();

    if (error) {
        console.error("Error fetching data:", error);
        return null;
    }

    console.log(data);
    return data;
}
