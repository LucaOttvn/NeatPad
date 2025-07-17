import React, { Dispatch, RefObject, SetStateAction } from 'react';
import SvgButton from './SvgButton';

interface DisableableInputProps {
    keyToUpdate: string
    updateData: Dispatch<SetStateAction<any>>
    values: { inputValue: any, disabled: boolean }
    inputRef: RefObject<HTMLInputElement | null>
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
    // handle the click on the eit/confirm button
    function handleInputsDisable() {
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
        // update only the [key] param
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
            <span>Update {props.keyToUpdate}</span>
            <div className='flex gap-2'>
                <input ref={props.inputRef} type="text" className='w-full' placeholder={`Insert ${props.keyToUpdate}`} disabled={props.values.disabled} value={props.values.inputValue} onChange={(e) => { handleInput(e) }} />

                <SvgButton style={{ display: props.values.disabled ? '' : 'none' }}
                    fileName='edit' onClick={handleInputsDisable} />
                <SvgButton style={{ display: props.values.disabled ? 'none' : '' }}
                    fileName='check' onClick={handleInputsDisable} />
            </div>
        </div>
    );
}