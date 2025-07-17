import { useContext, useEffect, useState } from 'react';
import PasswordInput from './PasswordInput';
import { validatePassword } from '@/utils/globalMethods';
import { UserContext } from '@/contexts/userContext';
import { deleteToken, getTokenData } from '@/db/resetPasswordTokens';

interface ResetPasswordFormProps {
    forgotPassword?: boolean
}

export default function ResetPasswordForm(props: ResetPasswordFormProps) {

    const userContext = useContext(UserContext)
    const [email, setEmail] = useState('')
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    })

    async function handleToken() {
        const tokenData = await getTokenData(email)
        userContext?.setUser(tokenData.user)
    }

    useEffect(() => {
        if (userContext?.user?.id) changePassword()
    }, [userContext?.user]);

    async function changePassword() {

        const validatedPassword = validatePassword(passwords.newPassword);
        if (!validatedPassword.isValid) return alert(validatedPassword.errors[0])

        let requestBody: {
            id: number;
            currentPassword: string | undefined;
            newPassword: string;
        } = {
            id: userContext?.user?.id!,
            currentPassword: undefined,
            newPassword: passwords.newPassword,
        }

        // if the user is in the forgot password 
        if (!props.forgotPassword) requestBody.currentPassword = passwords.currentPassword

        const response = await fetch(`/api/${props.forgotPassword ? 'forgotPassword' : 'changePassword'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) return alert(data.error || 'Failed to update password.')

        alert(data.message);

        // remove the token from the db when used
        if (props.forgotPassword) {
           await deleteToken(userContext?.user?.id!)
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>, key: string) {
        setPasswords((prev: any) => ({ ...prev, [key]: e.target.value }))
    }

    return (
        <div className='flex flex-col items-center gap-5'>

            {props.forgotPassword && <input type="email" placeholder="Insert email" className='w-full' value={email} onChange={(e) => { setEmail(e.target.value) }} />}

            {!props.forgotPassword && <PasswordInput onChange={(e) => { handleInput(e, 'currentPassword') }} value={passwords.currentPassword} placeholder={'Insert current password'} disabled={false} />}

            <PasswordInput onChange={(e) => { handleInput(e, 'newPassword') }} value={passwords.newPassword} placeholder={'Insert new password'} disabled={false} />

            <button className='mainBtn mt-3' onClick={() => {
                handleToken()
            }}>Confirm</button>
        </div>
    );
}