import { ModalsContext } from '@/contexts/modalsContext';
import { UserContext } from '@/contexts/userContext';
import { useContext } from 'react';

interface SettingsModalProps { }

export default function SettingsModal(props: SettingsModalProps) {
  const userContext = useContext(UserContext)
  const modalsContext = useContext(ModalsContext)

  function logout() {
    localStorage.clear();
    userContext?.setUser(null);
    modalsContext?.setSelectedModal(undefined)
  }
  
  return (
    <div className='settingsModal'>
      <button className='mainBtn' onClick={logout}>Logout</button>
    </div>
  );
}