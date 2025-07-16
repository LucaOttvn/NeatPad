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
      customColorsForSystemBars: true,
      statusBarColor: '#ff2d00',
      statusBarContent: 'light',
      navigationBarColor: '#ff2d00',
      navigationBarContent: 'light',
      offset: 1000,
      inset: 2000
    },
  },
};

export default config;