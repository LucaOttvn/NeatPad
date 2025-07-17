import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getUserById, updateUser } from '@/db/user';

// since the change password needs the bcrypt hash and compare methods and they are server-side-only, this function is declared as an api route
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function POST(request: Request) {

    const { id, currentPassword, newPassword } = await request.json();

    if (!id || !currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Missing user ID, current password, or new password.' }, { status: 400 });
    }

    const user = await getUserById(id)

    if (!user) return NextResponse.json({ error: 'Error checking current password.' }, { status: 500 });

    if (!user?.password) return NextResponse.json({ error: 'User data not found.' }, { status: 404 });

    // verify the current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
        return NextResponse.json({ error: 'Incorrect current password.' }, { status: 401 });
    }

    user.password = await hashPassword(newPassword)

    const response = await updateUser(user)

    if (!response) return NextResponse.json({ error: 'Error updating user.' }, { status: 500 });

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
}