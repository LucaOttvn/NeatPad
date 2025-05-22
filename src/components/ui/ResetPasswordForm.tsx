import { Dispatch, SetStateAction, useState } from 'react';
import PasswordInput from './PasswordInput';
import { supabase } from '@/api/supabaseClient';
import { validatePassword } from '@/utils/globalMethods';

export default function ResetPasswordForm() {

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    })

    function handleInput(e: React.ChangeEvent<HTMLInputElement>, key: string) {
        setPasswords((prev: any) => ({ ...prev, [key]: e.target.value }))
    }

    async function changePassword() {
        if (passwords.currentPassword == passwords.newPassword) {
            const validatedPassword = validatePassword(passwords.newPassword)
            if (validatedPassword.isValid) {
                const { data, error } = await supabase.auth.updateUser({
                    password: passwords.newPassword
                });
                if (error) alert(error)
            } else {
                alert(validatedPassword.errors[0])
            }
        }
        else {
            alert('The two passwords must be the same')
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