import { useContext, useState } from 'react';
import PasswordInput from './PasswordInput';
import { validatePassword } from '@/utils/globalMethods';
import { UserContext } from '@/contexts/userContext';
import { deleteToken } from '@/db/resetPasswordTokens';

interface ResetPasswordFormProps {
    forgotPassword?: boolean
}

export default function ResetPasswordForm(props: ResetPasswordFormProps) {

    const userContext = useContext(UserContext)
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    })

    function handleInput(e: React.ChangeEvent<HTMLInputElement>, key: string) {
        setPasswords((prev: any) => ({ ...prev, [key]: e.target.value }))
    }

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
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) await deleteToken(token)
        }
    }

    return (
        <div className='flex flex-col items-center gap-5'>
            {!props.forgotPassword && <PasswordInput onChange={(e) => { handleInput(e, 'currentPassword') }} value={passwords.currentPassword} placeholder={'Insert current password'} disabled={false} />}

            <PasswordInput onChange={(e) => { handleInput(e, 'newPassword') }} value={passwords.newPassword} placeholder={'Insert new password'} disabled={false} />

            <button className='mainBtn mt-3' onClick={() => {
                changePassword()
            }}>Confirm</button>
        </div>
    );
}