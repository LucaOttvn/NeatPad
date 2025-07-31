import { alreadyInstalledApp, isAppInstallable } from '@/utils/signals';

export default function InstallPWASection() {

  const handleClick = async () => {
    isAppInstallable.value.prompt();
    const { outcome } = await isAppInstallable.value.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    isAppInstallable.value = null;
  }

  if (!isAppInstallable.value) return

  return (
    <button onClick={handleClick} className='mainBtn'>
      {alreadyInstalledApp ? 'Open in app' : 'Install App'}
    </button>
  );
}