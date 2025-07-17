import { useContext, useState } from 'react';
import PasswordInput from './PasswordInput';
import { validatePassword } from '@/utils/globalMethods';
import { UserContext } from '@/contexts/userContext';

export default function ResetPasswordForm() {

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
        if (!validatedPassword.isValid) {
            alert(validatedPassword.errors[0]);
            return;
        }

        try {
            const response = await fetch('/api/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userContext?.user?.id,
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error || 'Failed to update password.');
            }

        } catch (error) {
            console.error('Error changing password:', error);
            alert('An unexpected error occurred.');
        }
    }
    return (
        <div className='flex flex-col items-center gap-5'>
            <PasswordInput onChange={(e) => { handleInput(e, 'currentPassword') }} value={passwords.currentPassword} placeholder={'Insert current password'} disabled={false} />

            <PasswordInput onChange={(e) => { handleInput(e, 'newPassword') }} value={passwords.newPassword} placeholder={'Insert new password'} disabled={false} />

            <button className='mainBtn mt-3' onClick={() => {
                changePassword()
            }}>Confirm</button>
        </div>
    );
}