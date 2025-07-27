import './settingsModal.scss';
import { ReactSVG } from 'react-svg';
import ResetPasswordForm from '../../ResetPasswordForm';
import { handleModal } from '@/utils/globalMethods';
import { deleteUser } from '@/serverActions/usersActions';
import { user } from '@/utils/signals';

interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {

  function logout() {
    localStorage.clear();
    user.value = undefined
    handleModal(undefined)
  }

  async function handleDeleteSupabaseUser() {
    if (!confirm('Do you really want to delete this account?')) return
    await deleteUser(user.value!.id!)
    logout()
  }

  return (
    <div className='settingsModal'>
      <span className='title center'>Settings</span>
      <div className='w-full h-full flex flex-col justify-between items-center mt-10'>
        <section className='profileSection'>
          <span className='w-full center gap-2 p-2' style={{ fontSize: '110%', background: '#101010', borderRadius: 'var(--mainBorderRadius)' }}>Email: <b>{user.value!.email}</b></span>
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