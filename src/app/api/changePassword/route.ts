import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabase } from '@/db/supabaseClient';

// since the change password needs the bcrypt hash and compare methods and this is server-side-only, these functions are declared as an api route
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function POST(request: Request) {
    try {
        const { id, currentPassword, newPassword } = await request.json();

        if (!id || !currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing user ID, current password, or new password.' }, { status: 400 });
        }

        // fetch the user from the database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('password')
            .eq('id', id)
            .single();

        if (userError) {
            console.error('Error fetching user for password check:', userError);
            return NextResponse.json({ error: 'Error checking current password.' }, { status: 500 });
        }

        if (!user?.password) {
            return NextResponse.json({ error: 'User data not found.' }, { status: 404 });
        }

        // verify the current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'Incorrect current password.' }, { status: 401 });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        // update the user's password in the db
        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedNewPassword })
            .eq('id', id);

        if (updateError) {
            console.error('Error updating password:', updateError);
            return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });

    } catch (error: any) {
        console.error('Error changing password via API:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}