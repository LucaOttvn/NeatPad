// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'neat-pad',
  webDir: 'out',
  server: {
    url: 'https://neat-pad.vercel.app/'
  }
};

export default config;