import { loading, user } from '@/utils/signals';
import React, { useState } from 'react';
import PasswordInput from '../../PasswordInput';
import { handleModal } from '@/utils/globalMethods';
import './loginModal.scss';
import { saveToken } from '@/serverActions/resetPasswordTokenActions';
import { getUserByEmail } from '@/serverActions/usersActions';

interface LoginModalProps {
    creatingAccount: boolean
}

export default function LoginModal(props: LoginModalProps) {

    

    const [formData, setFormData] = useState({ email: "", password: "" });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    // handle signin/signup
    async function handleSubmit() {

        loading.value = true
        handleModal(undefined)

        const response = await fetch(`/api/${props.creatingAccount ? 'signup' : 'signin'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email.trim(), password: formData.password.trim() }),
        });

        const JSONRes = await response.json()
        if (!response.ok) {
            loading.value = false
            if (response.status == 409) return alert('This user already exists')
            return alert(JSONRes.error)
        }

        localStorage.setItem('JWT', JSONRes.token)
        user.value = JSONRes.user

        loading.value = false
    }

    async function handleForgotPassword() {
        if (!formData.email) return alert("Please insert a valid email")

        const user = await getUserByEmail(formData.email)

        if (!user) return alert("No user found with this email")

        const token = crypto.randomUUID()

        await saveToken(token, user.id)

        const response = await fetch(`/api/sendEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email, resetLink: `https://www.neatpad.eu/recover-password?token=${token}` }),
        });

        if (!response.ok) return alert('Something went wrong, retry')

        return alert('A recovery email has been sent to your account')
    }

    return (
        <div className="loginModal">
            <h1 className="title center">
                {props.creatingAccount ? <div className="flex flex-col items-start">
                    <span className="">Create</span>
                    <span className="ms-3">Account</span>
                </div> : "Login"}
            </h1>
            <div className="flex flex-col gap-5" onKeyDown={handleKeyDown}>
                <input
                    onChange={handleChange}
                    type="text"
                    onKeyDown={handleKeyDown}
                    name="email"
                    placeholder="Insert email"
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