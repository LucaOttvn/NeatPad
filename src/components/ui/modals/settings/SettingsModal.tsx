import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import ResetPasswordForm from '../../ResetPasswordForm';
import { deleteUser } from '@/serverActions/usersActions';
import { loading, user } from '@/utils/signals';
import { signOut } from "next-auth/react";


interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {

  async function handleDeleteSupabaseUser() {
    if (!confirm('Do you really want to delete this account?')) return
    loading.value = true
    await deleteUser(user.value!.email)
    loading.value = false
    signOut()
  }

  return (
    <div className='settingsModal'>
      <span className='title center'>Settings</span>
      <div className='w-full h-full flex flex-col justify-between items-center mt-10'>
        <section className='profileSection'>
          <span className='w-full start gap-2 p-2'>Email: <b style={{background: 'var(--Grey)', padding: '0 0.5rem'}}>{user.value!.email}</b></span>
          <div className="start">
            <input type="checkbox" />
            <span>Offline mode</span>
          </div>
        </section>
        <div className='flex items-center gap-5'>
          <button className='mainBtn center gap-2' style={{ background: 'var(--Grey)' }} onClick={()=> signOut()}><ReactSVG src={'/icons/logout.svg'} className="icon" />Logout</button>
          <button className='mainBtn' style={{ background: 'var(--Red)' }} onClick={() => { handleDeleteSupabaseUser() }}>Delete account</button>
        </div>
      </div>
    </div>
  );
}