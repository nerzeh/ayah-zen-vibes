import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PremiumContextType {
  isPremium: boolean;
  wallpaperCount: number;
  wallpaperLimit: number;
  isLoading: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  incrementWallpaperCount: () => Promise<void>;
  canDownloadWallpaper: boolean;
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
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [wallpaperCount, setWallpaperCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const wallpaperLimit = 5; // Free users limited to 5 wallpapers

  // Load premium status from database
  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setWallpaperCount(0);
      setIsLoading(false);
      return;
    }

    loadPremiumStatus();
  }, [user]);

  const loadPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('user_premium')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading premium status:', error);
        return;
      }

      if (data) {
        setIsPremium(data.is_premium || false);
        setWallpaperCount(data.wallpaper_count || 0);
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePremium = async () => {
    // For web/demo, just set premium status
    await updatePremiumStatus(true);
  };

  const restorePurchases = async () => {
    // For web/demo, reload premium status
    await loadPremiumStatus();
  };

  const updatePremiumStatus = async (premium: boolean) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('user_premium')
        .upsert([{
          user_id: user.id,
          is_premium: premium,
          wallpaper_count: wallpaperCount,
          updated_at: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Error updating premium status:', error);
        return;
      }

      setIsPremium(premium);
    } catch (error) {
      console.error('Error updating premium status:', error);
    }
  };

  const incrementWallpaperCount = async () => {
    if (!user || isPremium) return; // Premium users have unlimited

    const newCount = wallpaperCount + 1;
    
    try {
      const { error } = await (supabase as any)
        .from('user_premium')
        .upsert([{
          user_id: user.id,
          is_premium: isPremium,
          wallpaper_count: newCount,
          updated_at: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Error updating wallpaper count:', error);
        return;
      }

      setWallpaperCount(newCount);
    } catch (error) {
      console.error('Error updating wallpaper count:', error);
    }
  };

  const canDownloadWallpaper = isPremium || wallpaperCount < wallpaperLimit;

  const contextValue: PremiumContextType = {
    isPremium,
    wallpaperCount,
    wallpaperLimit,
    isLoading,
    purchasePremium,
    restorePurchases,
    incrementWallpaperCount,
    canDownloadWallpaper,
  };

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
};