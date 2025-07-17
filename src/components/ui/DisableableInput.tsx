import React, { Dispatch, RefObject, SetStateAction } from 'react';
import SvgButton from './SvgButton';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';

interface DisableableInputProps {
    keyToUpdate: string
    updateData: Dispatch<SetStateAction<any>>
    values: { inputValue: any, disabled: boolean }
    inputRef: RefObject<HTMLInputElement | null>
    showToggle?: boolean
    placeholder?: string
    type?: string
}

// This component expects an object like { inputValue: any, disabled: boolean }
// the `keyToUpdate` prop specifies which field's 'disabled' property to toggle
// the parent component provides an `updateData` function to modify its state
// 
// An example can be found in SettingsModal.tsx, where there's the profileData state that is made like this: 
// {
// email: { value: value, disabled: value},
// password: { value: value, disabled: value}
// }
export default function DisableableInput(props: DisableableInputProps) {

    const key = props.keyToUpdate
    // handle the click on the edit/confirm button
    async function handleInputsDisable() {
        
        props.updateData((prev: any) => {
            const currentItem = prev[key];
            const updatedItem = {
                ...currentItem,
                disabled: !currentItem.disabled,
            };
            return {
                ...prev,
                [key]: updatedItem,
            };
        });
    }

    // handle the text input
    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        props.updateData((prev: any) => {
            const currentItem = prev[key]
            const updatedItem = {
                ...currentItem,
                value: e.target.value
            }
            return {
                ...prev,
                [key]: updatedItem
            }
        })
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-start gap-2'>
                {(props.keyToUpdate != 'email' && props.keyToUpdate != 'password' && props.keyToUpdate != 'newPassword') && <input ref={props.inputRef} type={props.type || 'text'} className='w-full' placeholder={`Insert ${props.placeholder || props.keyToUpdate}`} disabled={props.values.disabled} value={props.values.inputValue} onChange={(e) => { handleInput(e) }} />}

                {props.keyToUpdate == 'email' && <EmailInput disabled={props.values.disabled} onChange={handleInput} value={props.values.inputValue} inputRef={props.inputRef} />}
                {props.keyToUpdate == 'password' && <PasswordInput disabled={props.values.disabled} onChange={handleInput} value={props.values.inputValue} inputRef={props.inputRef} />}
                {props.keyToUpdate == 'newPassword' && <PasswordInput disabled={props.values.disabled} onChange={handleInput} value={props.values.inputValue} inputRef={props.inputRef} placeholder='Insert new password' />}

                {props.showToggle && <>
                    <SvgButton style={{ display: props.values.disabled ? '' : 'none' }}
                        fileName='edit' onClick={handleInputsDisable} className='pt-1' />
                    <SvgButton style={{ display: props.values.disabled ? 'none' : '' }}
                        fileName='check' onClick={handleInputsDisable} className='pt-1' />
                </>}
            </div>
        </div>
    );
}