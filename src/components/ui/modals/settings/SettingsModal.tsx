import { ModalsContext } from '@/contexts/modalsContext';
import { UserContext } from '@/contexts/userContext';
import { useContext, useEffect, useRef, useState } from 'react';
import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import SvgButton from '../../SvgButton';
import DisableableInput from '../../DisableableInput';

interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {
  const userContext = useContext(UserContext)
  const modalsContext = useContext(ModalsContext)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState({
    email: { value: userContext?.user?.email, disabled: true },
    password: { value: '', disabled: true }
  })

  function logout() {
    localStorage.clear();
    userContext?.setUser(null);
    modalsContext?.setSelectedModal(undefined)
  }

  useEffect(() => {
    if (!profileData.email.disabled) emailInputRef.current?.focus();
    if (!profileData.email.disabled) passwordInputRef.current?.focus();
  }, [profileData.email.disabled, profileData.password.disabled]);

  useEffect(() => {
    console.log(profileData.email.value)
  }, [profileData.email.value]);


  return (
    <div className='settingsModal'>
      <span className='title'>Settings</span>
      <div className='w-full h-full flex flex-col justify-between mt-20'>
        <section className='profileSection'>
          <h1 className='w-full center' style={{ fontSize: '140%' }}>Profile</h1>
          {/* email input field with modify/confirm button */}

          <DisableableInput keyToUpdate='email' updateData={setProfileData} values={{ inputValue: profileData.email.value, disabled: profileData.email.disabled }} inputRef={emailInputRef}/>
          <DisableableInput keyToUpdate='password' updateData={setProfileData} values={{ inputValue: profileData.password.value, disabled: profileData.password.disabled }} inputRef={passwordInputRef}/>

          {/* <div className='flex flex-col gap-2'>
            <span>Change password</span>
            <div className='flex gap-2'>
              <input ref={inputRef} type="text" className='w-full' placeholder='Insert current password' disabled={profileData.password.disabled} value={profileData.password.password} />
              <SvgButton style={{ display: profileData.password.disabled ? '' : 'none' }}
                fileName='edit' onClick={() => { handleInputsDisable('password') }} />
              <SvgButton style={{ display: profileData.password.disabled ? 'none' : '' }}
                fileName='check' onClick={() => { handleInputsDisable('password') }} />
            </div>
          </div> */}
        </section>
        <div className='flex flex-col items-center gap-5'>
          <button className='mainBtn center gap-2' style={{ background: 'var(--darkGrey)' }} onClick={logout}><ReactSVG src={'/icons/logout.svg'} className="icon" />Logout</button>
          <button className='mainBtn' style={{ background: 'var(--Red)' }} >Delete account</button>
        </div>
      </div>
    </div>
  );
}