import { useEffect, useState } from 'react';
import PasswordInput from './PasswordInput';
import { validatePassword } from '@/utils/globalMethods';

import { deleteToken, getTokenData } from '@/serverActions/resetPasswordTokenActions';
import { user } from '@/utils/signals';

interface ResetPasswordFormProps {
    forgotPassword?: boolean
    token?: string
}

export default function ResetPasswordForm(props: ResetPasswordFormProps) {


    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    })

    useEffect(() => {
        async function handleToken() {
            let tokenData
            if (props.token) tokenData = await getTokenData(props.token)
            user.value = tokenData.user
        }
        if (props.forgotPassword && props.token) handleToken()
    }, []);

    async function changePassword() {

        if (!user.value) return alert('Missing user')

        const validatedPassword = validatePassword(passwords.newPassword);
        // return the first error in the errors array
        if (!validatedPassword.isValid) return alert(validatedPassword.errors[0])

        let requestBody: {
            email: string;
            currentPassword: string | undefined;
            newPassword: string;
        } = {
            email: user.value!.email,
            currentPassword: undefined,
            newPassword: passwords.newPassword,
        }

        // the current password field only exists in the change password screen, so leave it undefined otherwise
        if (!props.forgotPassword) requestBody.currentPassword = passwords.currentPassword

        // check which api to call based on forgotPassword mode true or false
        const response = await fetch(`/api/${props.forgotPassword ? 'forgotPassword' : 'changePassword'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) return alert(data.error || 'Failed to update password.')

        // alert the success message
        alert(data.message);

        // remove the token from the db when used
        if (props.forgotPassword) {
            await deleteToken(user.value!.email)
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>, key: string) {
        setPasswords((prev: any) => ({ ...prev, [key]: e.target.value }))
    }

    return (
        <div className='w-full flex flex-col items-center gap-5'>

            {!props.forgotPassword && <PasswordInput onChange={(e) => { handleInput(e, 'currentPassword') }} value={passwords.currentPassword} placeholder={'Insert current password'} disabled={false} />}

            <PasswordInput onChange={(e) => { handleInput(e, 'newPassword') }} value={passwords.newPassword} placeholder={'Insert new password'} disabled={false} />

            <button className='mainBtn mt-3' onClick={() => {
                changePassword()
            }}>Confirm</button>
        </div>
    );
}