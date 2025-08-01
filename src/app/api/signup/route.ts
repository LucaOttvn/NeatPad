import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/utils/supabaseClient';

async function hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Please provide both email and password.' }, { status: 400 });
        }

        // check if the email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists.' }, { status: 409 }); // 409 Conflict
        }

        const hashedPassword = await hashPassword(password);

        const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert({ email: email, password: hashedPassword })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user:', insertError);
            return NextResponse.json({ error: `Failed to create user: ${insertError.message}` }, { status: 500 });
        }

        const token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, JWT_SECRET, { expiresIn: '7d' });
        return NextResponse.json({ message: 'User created successfully', token, user: createdUser }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}