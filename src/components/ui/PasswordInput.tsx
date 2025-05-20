import { validatePassword } from '@/utils/globalMethods';
import React, { RefObject, useEffect, useState } from 'react';
import SvgButton from './SvgButton';

interface PasswordInputProps {
    inputRef?: RefObject<HTMLInputElement | null>
    disabled: boolean
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
}

export default function PasswordInput(props: PasswordInputProps) {

    const [visiblePassword, setVisiblePassword] = useState<boolean | undefined>()

    useEffect(() => {
        // the condition != undefined is used to check whether the component is mounted to avoid triggering the focus() on component mount, in fact the focus() has to be triggered only by user click
        // by default the browser loses the focus when the eye button is pressed, so maintain the focus on it even in that case
        if (visiblePassword != undefined) props.inputRef?.current?.focus()
    }, [visiblePassword]);
    return (
        <div className='w-full flex flex-col'>
            <div className='flex gap-1'>
                <input ref={props.inputRef} type={visiblePassword ? 'text' : 'password'} className='w-full' placeholder={props.placeholder || 'Insert password'} disabled={props.disabled} value={props.value} onChange={(e) => { props.onChange(e) }} />
                {!props.disabled && <>
                    <SvgButton style={{ display: visiblePassword ? '' : 'none' }}
                        fileName='eyeSlash' onClick={() => {
                            setVisiblePassword(prev => !prev)
                        }} />
                    <SvgButton style={{ display: visiblePassword ? 'none' : '' }}
                        fileName='eyeFill' onClick={() => {
                            setVisiblePassword(prev => !prev)
                        }} />
                </>}
            </div>
            {!props.disabled && <span className='mt-1' style={{ color: 'var(--Red)', fontSize: '80%' }}>{validatePassword(props.value).errors[0] || ''}</span>}
        </div>
    );
}