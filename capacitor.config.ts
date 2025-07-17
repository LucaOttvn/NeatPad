// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.lucaottaviano.neatpad',
  appName: 'neat-pad',
  webDir: 'out',
  server: {
    url: 'https://neat-pad.vercel.app/'
  }
};

export default config;