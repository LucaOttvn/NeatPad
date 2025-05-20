import { validateEmail } from '@/utils/globalMethods';
import React, { RefObject } from 'react';

interface EmailInputProps {
    inputRef?: RefObject<HTMLInputElement | null>
    disabled: boolean
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EmailInput(props: EmailInputProps) {
    return (
        <div className='w-full flex flex-col'>
            <input ref={props.inputRef} type={'email'} className='w-full' placeholder='Insert email' disabled={props.disabled} value={props.value} onChange={(e) => { props.onChange(e) }} />
            {props.disabled != true && <span style={{color: 'var(--Red)', fontSize: '80%'}}>{validateEmail(props.value).error || ''}</span>}
        </div>
    );
}