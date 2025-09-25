import { useSubscription } from './useSubscription';
import { PREMIUM_FEATURES, FREE_TIER_LIMITS } from '@/constants/premiumFeatures';

export const usePremiumFeature = (featureId: keyof typeof PREMIUM_FEATURES) => {
  const { subscriptionStatus, loading } = useSubscription();

  const hasAccess = () => {
    if (loading) return false;
    
    const feature = PREMIUM_FEATURES[featureId];
    if (!feature.isPremiumOnly) return true;
    
    return subscriptionStatus.isPremium;
  };

  const getFeatureInfo = () => {
    return PREMIUM_FEATURES[featureId];
  };

  return {
    hasAccess: hasAccess(),
    isLoading: loading,
    feature: getFeatureInfo(),
    subscriptionStatus
  };
};

export const useFreeTierLimits = () => {
  const { subscriptionStatus } = useSubscription();

  const getVerseLimit = () => {
    return subscriptionStatus.isPremium ? Infinity : FREE_TIER_LIMITS.MAX_VERSES;
  };

  const getBackgroundLimit = () => {
    return subscriptionStatus.isPremium ? Infinity : FREE_TIER_LIMITS.MAX_BACKGROUNDS;
  };

  const getFavoritesLimit = () => {
    return subscriptionStatus.isPremium ? Infinity : FREE_TIER_LIMITS.MAX_FAVORITES;
  };

  const shouldShowAds = () => {
    return !subscriptionStatus.isPremium && FREE_TIER_LIMITS.SHOW_ADS;
  };

  const canUseAutoWallpaper = () => {
    return subscriptionStatus.isPremium;
  };

  const getWidgetStylesLimit = () => {
    return subscriptionStatus.isPremium ? Infinity : FREE_TIER_LIMITS.WIDGET_STYLES;
  };

  return {
    verseLimit: getVerseLimit(),
    backgroundLimit: getBackgroundLimit(),
    favoritesLimit: getFavoritesLimit(),
    shouldShowAds: shouldShowAds(),
    canUseAutoWallpaper: canUseAutoWallpaper(),
    widgetStylesLimit: getWidgetStylesLimit(),
    isPremium: subscriptionStatus.isPremium
  };
};