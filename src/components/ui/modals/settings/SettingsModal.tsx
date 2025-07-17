import { UserContext } from '@/contexts/userContext';
import { useContext } from 'react';
import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import ResetPasswordForm from '../../ResetPasswordForm';
import { deleteUser } from '@/db/user';
import { handleModal } from '@/utils/globalMethods';

interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {
  const userContext = useContext(UserContext)

  function logout() {
    localStorage.clear();
    userContext?.setUser(undefined);
    handleModal(undefined)
  }

  async function handleDeleteSupabaseUser() {
    if (confirm('Do you really want to delete this account?')) {
      if (userContext?.user) {
        await deleteUser(userContext.user.id!)
        logout()
      }
    }
  }

  return (
    <div className='settingsModal'>
      <span className='title center'>Settings</span>
      <div className='w-full h-full flex flex-col justify-between items-center mt-10'>
        <section className='profileSection'>
          <span className='w-full center gap-2 p-2' style={{ fontSize: '110%', background: '#101010', borderRadius: 'var(--mainBorderRadius)' }}>Email: <b>{userContext?.user?.email}</b></span>
          <div className="changePswd">
            <h1 className='w-full center' style={{ fontSize: '140%' }}>Change password</h1>
            <ResetPasswordForm />
          </div>
        </section>
        <div className='flex items-center gap-5'>
          <button className='mainBtn center gap-2' style={{ background: 'var(--Grey)' }} onClick={logout}><ReactSVG src={'/icons/logout.svg'} className="icon" />Logout</button>
          <button className='mainBtn' style={{ background: 'var(--Red)' }} onClick={() => { handleDeleteSupabaseUser() }}>Delete account</button>
        </div>
      </div>
    </div>
  );
}