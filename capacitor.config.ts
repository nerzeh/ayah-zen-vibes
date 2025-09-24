import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.43fbf637605d4ddb8ad6c9345d37719b',
  appName: 'Ayah Wallpapers',
  webDir: 'dist',
  server: {
    url: 'https://43fbf637-605d-4ddb-8ad6-c9345d37719b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#047857',
      showSpinner: false
    }
  }
};

export default config;