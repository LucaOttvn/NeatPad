import { ModalsContext } from '@/contexts/modalsContext';
import { UserContext } from '@/contexts/userContext';
import { useContext, useEffect, useRef, useState } from 'react';
import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import { gsap, Power4 } from 'gsap';
import { updateUser } from '@/api/user';
import { supabase } from '@/api/supabaseClient';
import ResetPasswordForm from '../../ResetPasswordForm';

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

 

  useEffect(() => {
    if (!profileData.email.disabled) {
      emailInputRef.current?.focus();
    } else {
      if (userContext?.user?.email != profileData.email.value) {
        updateUser({ email: 'test3@gmail.com' })
      }
    }
  }, [profileData.email.disabled]);

  

  function logout() {
    localStorage.clear();
    userContext?.setUser(null);
    modalsContext?.setSelectedModal(undefined)
  }

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
          <h1 className='w-full center' style={{ fontSize: '140%' }}>Change password</h1>
          <ResetPasswordForm/>
        </section>
        <div className='flex flex-col items-center gap-5'>
          <button className='mainBtn center gap-2' style={{ background: 'var(--darkGrey)' }} onClick={logout}><ReactSVG src={'/icons/logout.svg'} className="icon" />Logout</button>
          <button className='mainBtn' style={{ background: 'var(--Red)' }} >Delete account</button>
        </div>
      </div>
    </div>
  );
}