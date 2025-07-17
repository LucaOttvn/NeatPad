import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'neat-pad',
  webDir: 'out',
  server: {
    url: 'http://192.168.10.39:3000',
    cleartext: true
  }
};

export default config;
