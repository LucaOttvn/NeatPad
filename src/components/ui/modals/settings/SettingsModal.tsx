import { ModalsContext } from '@/contexts/modalsContext';
import { UserContext } from '@/contexts/userContext';
import { useContext } from 'react';
import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import ResetPasswordForm from '../../ResetPasswordForm';
import { deleteUserAccount } from '@/serverActions/authActions';


interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {
  const userContext = useContext(UserContext)
  const modalsContext = useContext(ModalsContext)

  function logout() {
    localStorage.clear();
    userContext?.setUser(null);
    modalsContext?.setSelectedModal(undefined)
  }

  function handleDeleteSupabaseUser() {
    if (confirm('Do you really want to delete this account?')) {
      if (userContext?.user) {
        deleteUserAccount(userContext.user.id)
        logout()
      }
    }
  }

  return (
    <div className='settingsModal'>
      <span className='title'>Settings</span>
      <div className='w-full h-full flex flex-col justify-between mt-20'>
        <section className='profileSection'>
          <h1 className='w-full center' style={{ fontSize: '140%' }}>Change password</h1>
          <ResetPasswordForm />
        </section>
        <div className='flex flex-col items-center gap-5'>
          <button className='mainBtn center gap-2' style={{ background: 'var(--darkGrey)' }} onClick={logout}><ReactSVG src={'/icons/logout.svg'} className="icon" />Logout</button>
          <button className='mainBtn' style={{ background: 'var(--Red)' }} onClick={() => { handleDeleteSupabaseUser() }}>Delete account</button>
        </div>
      </div>
    </div>
  );
}