import { PremiumFeature } from '@/types/subscription';

export const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  COMPLETE_LIBRARY: {
    id: 'complete_library',
    name: 'Complete Verse Library',
    description: 'Access to 500+ Quranic verses instead of just 25 popular verses',
    isPremiumOnly: true
  },
  PREMIUM_BACKGROUNDS: {
    id: 'premium_backgrounds',
    name: 'Premium Wallpaper Backgrounds',
    description: '20+ beautiful Islamic wallpaper backgrounds beyond basic gradients',
    isPremiumOnly: true
  },
  AUTO_WALLPAPER: {
    id: 'auto_wallpaper',
    name: 'Auto-Wallpaper Scheduler',
    description: 'Automatically update your wallpaper daily with new verses',
    isPremiumOnly: true
  },
  ADVANCED_CUSTOMIZATION: {
    id: 'advanced_customization',
    name: 'Advanced Text Customization',
    description: 'Custom fonts, colors, and positioning for perfect wallpapers',
    isPremiumOnly: true
  },
  MULTIPLE_WIDGETS: {
    id: 'multiple_widgets',
    name: 'Multiple Widget Styles',
    description: 'Various widget styles and sizes for your home screen',
    isPremiumOnly: true
  },
  PRAYER_TIMES: {
    id: 'prayer_times',
    name: 'Prayer Time Integration',
    description: 'Display prayer times alongside your daily verses',
    isPremiumOnly: true
  },
  UNLIMITED_FAVORITES: {
    id: 'unlimited_favorites',
    name: 'Unlimited Favorites Sync',
    description: 'Save unlimited verses and sync across all your devices',
    isPremiumOnly: true
  },
  AD_FREE: {
    id: 'ad_free',
    name: 'Ad-Free Experience',
    description: 'Enjoy the app without any banner advertisements',
    isPremiumOnly: true
  }
};

export const FREE_TIER_LIMITS = {
  MAX_VERSES: 25,
  MAX_BACKGROUNDS: 3,
  MAX_FAVORITES: 10,
  SHOW_ADS: true,
  WIDGET_STYLES: 1,
  AUTO_WALLPAPER: false
} as const;