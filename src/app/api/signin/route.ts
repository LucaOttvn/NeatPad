import { supabase } from '@/api/supabaseClient';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Please provide both email and password.' }, { status: 400 });
        }

        // check if the user exists by email
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 }); // 401 Unauthorized
        }

        // compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return NextResponse.json({ message: 'Login successful', token, user: { id: user.id, email: user.email } }, { status: 200 });

    } catch (error: any) {
        console.error('Signin error:', error);
        return NextResponse.json({ error: 'Error during login.' }, { status: 500 });
    }
}