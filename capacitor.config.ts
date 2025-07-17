import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.lucaottaviano.neatpad',
  appName: 'neat-pad',
  webDir: 'out',
  server: {
    url: 'https://www.neatpad.eu'
    // url: 'http://192.168.1.79:3000'
  },
  plugins: {
    SafeArea: {
      enabled: true,
    },
  },
};

export default config;