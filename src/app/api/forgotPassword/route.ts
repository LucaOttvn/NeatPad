import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getUserById, updateUser } from '@/serverActions/usersActions';

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// update password
export async function POST(request: Request) {
    try {
        const requestJSON = await request.json();

        const user = await getUserById(requestJSON.id)

        if (!user) throw new Error('No user found')

        user.password = await hashPassword(requestJSON.newPassword)
        await updateUser(user)

        return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
    } catch (error: any) {
        console.error('Error changing password via API:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}