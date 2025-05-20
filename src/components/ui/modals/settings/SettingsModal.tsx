import { ModalsContext } from '@/contexts/modalsContext';
import { UserContext } from '@/contexts/userContext';
import { useContext, useEffect, useRef, useState } from 'react';
import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import DisableableInput from '../../DisableableInput';
import { gsap, Power4 } from 'gsap'
import PasswordInput from '../../PasswordInput';

interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {
  const userContext = useContext(UserContext)
  const modalsContext = useContext(ModalsContext)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const newPasswordInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState({
    email: { value: userContext?.user?.email, disabled: true },
    password: { value: '', disabled: true },
    newPassword: { value: '', disabled: true }
  })

  function logout() {
    localStorage.clear();
    userContext?.setUser(null);
    modalsContext?.setSelectedModal(undefined)
  }

  useEffect(() => {
    if (!profileData.email.disabled) emailInputRef.current?.focus();
  }, [profileData.email.disabled]);

  useEffect(() => {
    if (!profileData.password.disabled) passwordInputRef.current?.focus();

    gsap.to('.newPassword', {
      height: profileData.password.disabled ? 0 : 'auto',
      ease: Power4.easeOut,
      duration: 0.2
    })
  }, [profileData.password.disabled]);

  return (
    <div className='settingsModal'>
      <span className='title'>Settings</span>
      <div className='w-full h-full flex flex-col justify-between mt-20'>
        <section className='profileSection'>
          <h1 className='w-full center' style={{ fontSize: '140%' }}>Update profile</h1>
          {/* email and password input fields with modify/confirm button */}
          <DisableableInput keyToUpdate='email' updateData={setProfileData} values={{ inputValue: profileData.email.value, disabled: profileData.email.disabled }} inputRef={emailInputRef} showToggle={true} />
          <DisableableInput keyToUpdate='password' updateData={setProfileData} values={{ inputValue: profileData.password.value, disabled: profileData.password.disabled }} inputRef={passwordInputRef} placeholder='current password' type='password' showToggle={true} />
          <div className='newPassword'>
            <DisableableInput keyToUpdate='newPassword' updateData={setProfileData} values={{ inputValue: profileData.newPassword.value, disabled: false }} inputRef={newPasswordInputRef} placeholder='new password' type='password' />

            {/* <PasswordInput disabled={false} onChange={(e) => {
              setProfileData((prev: any) => {
                const currentItem = prev.newPassword
                const updatedItem = {
                  ...currentItem,
                  value: e.target.value
                }
                return {
                  ...prev,
                  newPassword: updatedItem
                }
              })
            }} value={props.values.inputValue} inputRef={props.inputRef} /> */}
          </div>

        </section>
        <div className='flex flex-col items-center gap-5'>
          <button className='mainBtn center gap-2' style={{ background: 'var(--darkGrey)' }} onClick={logout}><ReactSVG src={'/icons/logout.svg'} className="icon" />Logout</button>
          <button className='mainBtn' style={{ background: 'var(--Red)' }} >Delete account</button>
        </div>
      </div>
    </div>
  );
}