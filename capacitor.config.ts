import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.43fbf637605d4ddb8ad6c9345d37719b',
  appName: 'ayah-zen-vibes',
  webDir: 'dist',
  server: {
    url: 'https://43fbf637-605d-4ddb-8ad6-c9345d37719b.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    PurchasesPlugin: {
      // RevenueCat will be configured at runtime
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#047857',
      showSpinner: false
    }
  },
};

export default config;