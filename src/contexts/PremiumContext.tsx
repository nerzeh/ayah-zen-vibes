import React, { createContext, useContext, useState, useEffect } from 'react';
import { revenueCatService, SubscriptionInfo, OfferingData } from '@/services/revenueCatService';
import { Capacitor } from '@capacitor/core';

interface PremiumContextType {
  isPremium: boolean;
  hasNoAds: boolean;
  wallpaperCount: number;
  wallpaperLimit: number;
  isLoading: boolean;
  subscriptionInfo: SubscriptionInfo | null;
  currentOffering: OfferingData | null;
  purchasePackage: (packageId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  incrementWallpaperCount: () => Promise<void>;
  canDownloadWallpaper: boolean;
  managementURL: string | null;
  syncEntitlements: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: React.ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [hasNoAds, setHasNoAds] = useState(false);
  const [wallpaperCount, setWallpaperCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<OfferingData | null>(null);
  const [managementURL, setManagementURL] = useState<string | null>(null);
  
  const wallpaperLimit = 5;
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      if (isNative) {
        const apiKey = 'demo_key'; // Replace with actual keys
        await revenueCatService.configure({ apiKey });
        await loadOfferings();
        await syncEntitlements();
      } else {
        await loadPremiumStatusFromDatabase();
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      await loadPremiumStatusFromDatabase();
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfferings = async () => {
    try {
      const offering = await revenueCatService.getOfferings();
      setCurrentOffering(offering);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    }
  };

  const syncEntitlements = async () => {
    try {
      const info = await revenueCatService.getCustomerInfo();
      updateSubscriptionState(info);
    } catch (error) {
      console.error('Failed to sync entitlements:', error);
    }
  };

  const updateSubscriptionState = (info: SubscriptionInfo) => {
    setSubscriptionInfo(info);
    setIsPremium(info.isPremium);
    setHasNoAds(info.hasNoAds);
    setManagementURL(info.managementURL || null);
  };

  const loadPremiumStatusFromDatabase = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsPremium(false);
        setHasNoAds(false);
        setWallpaperCount(0);
        return;
      }

      const { data: premiumData } = await supabase
        .from('user_premium')
        .select('is_premium, wallpaper_count')
        .eq('user_id', user.id)
        .maybeSingle();

      if (premiumData) {
        setIsPremium(premiumData.is_premium);
        setHasNoAds(premiumData.is_premium);
        setWallpaperCount(premiumData.wallpaper_count);
      } else {
        await supabase.from('user_premium').insert({
          user_id: user.id,
          is_premium: false,
          wallpaper_count: 0
        });
        setIsPremium(false);
        setHasNoAds(false);
        setWallpaperCount(0);
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const purchasePackage = async (packageId: string) => {
    try {
      if (!isNative || !currentOffering) {
        throw new Error('Purchases only available on native platforms');
      }

      const packageToPurchase = currentOffering.availablePackages.find(
        pkg => pkg.identifier === packageId
      ) || currentOffering.monthly || currentOffering.annual || currentOffering.lifetime;

      if (!packageToPurchase) {
        throw new Error('Package not found');
      }

      const info = await revenueCatService.purchasePackage(packageToPurchase);
      updateSubscriptionState(info);
      await updateDatabasePremiumStatus(info.isPremium);
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const updateDatabasePremiumStatus = async (isPremiumStatus: boolean) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('user_premium').upsert({
          user_id: user.id,
          is_premium: isPremiumStatus,
          purchase_date: isPremiumStatus ? new Date().toISOString() : null
        });
      }
    } catch (error) {
      console.error('Failed to update database premium status:', error);
    }
  };

  const restorePurchases = async () => {
    try {
      if (isNative) {
        const info = await revenueCatService.restorePurchases();
        updateSubscriptionState(info);
        await updateDatabasePremiumStatus(info.isPremium);
      } else {
        await loadPremiumStatusFromDatabase();
      }
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };

  const incrementWallpaperCount = async () => {
    if (isPremium) return;

    try {
      const newCount = wallpaperCount + 1;
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('user_premium').upsert({
          user_id: user.id,
          wallpaper_count: newCount
        });
        setWallpaperCount(newCount);
      }
    } catch (error) {
      console.error('Error incrementing wallpaper count:', error);
      throw error;
    }
  };

  const canDownloadWallpaper = isPremium || wallpaperCount < wallpaperLimit;

  const contextValue: PremiumContextType = {
    isPremium,
    hasNoAds,
    wallpaperCount,
    wallpaperLimit,
    isLoading,
    subscriptionInfo,
    currentOffering,
    purchasePackage,
    restorePurchases,
    incrementWallpaperCount,
    canDownloadWallpaper,
    managementURL,
    syncEntitlements,
  };

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
};