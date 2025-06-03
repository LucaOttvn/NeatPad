import { UserContext } from '@/contexts/userContext';
import { selectedModal } from '@/utils/signals';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import PasswordInput from '../PasswordInput';
import { supabase } from '@/api/supabaseClient';
import { getUserByEmail } from '@/api/user';

interface LoginModalProps {
    creatingAccount: boolean
}

export default function LoginModal(props: LoginModalProps) {

    const router = useRouter()

    const userContext = useContext(UserContext);

    const [formData, setFormData] = useState({ email: "", password: "" });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.name)
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    }


    async function handleSubmit() {
        selectedModal.value = undefined

        try {
            const response = await fetch(`/api/${props.creatingAccount ? 'signup' : 'signin'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            if (response.ok) {
                const JSONRes = await response.json()
                localStorage.setItem('JWT', JSONRes.token)
                userContext?.setUser(JSONRes.user);

            } else {
                if (response.status == 409) alert('This user already exists')
                else {
                    alert('Something went wrong, retry')
                }
            }
        } catch (error: any) {
            console.error('Error during signup:', error);
        }
    }

    async function handleForgotPassword() {
        if (!formData.email) {
            alert("Please insert a valid email")
            return
        }

        const user = await getUserByEmail(formData.email)

        if (!user) {
            alert("No user found with this email")
            return
        }
        supabase.auth.resetPasswordForEmail(formData.email, {
            redirectTo: 'http://localhost:3001/recover-password'
        })

        const { data, error } = await supabase.auth.resetPasswordForEmail(formData.email, {
            redirectTo: 'http://localhost:3001/recover-password'
        });

        if (error) {
            alert("Something went wrong")
        } else {
            alert('Password reset link sent to your email.');
        }
    }

    return (
        <div className="loginModal w-full h-full center flex-col gap-8">
            <h1 className="title">
                {props.creatingAccount ? <div className="flex flex-col items-start">
                    <span className="">Create</span>
                    <span className="ms-3">Account</span>
                </div> : "Login"}
            </h1>
            <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                <input
                    onChange={handleChange}
                    type="text"
                    onKeyDown={handleKeyDown}
                    name="email"
                    placeholder="Email"
                />
                <PasswordInput disabled={false} onChange={handleChange} value={formData.password} />
                {!props.creatingAccount && <div className='w-full center'>
                    <button className='mainBtn w-full center' style={{ fontSize: '90%', background: 'transparent', color: 'var(--White)' }} onClick={handleForgotPassword}>Forgot password?</button>
                </div>}
            </div>
            <button
                className="mainBtn"
                onClick={async () => {
                    handleSubmit();
                }}
            >
                {props.creatingAccount ? "Confirm" : "Login"}
            </button>
        </div>
    );
}