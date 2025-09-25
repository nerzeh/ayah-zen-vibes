import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isPremium, setIsPremium] = useState(false);
  const [wallpaperCount, setWallpaperCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const wallpaperLimit = 5; // Free users limited to 5 wallpapers

  // Load premium status on mount
  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      // Import inside function to avoid circular dependency
      const { useAuth } = await import('./AuthContext');
      const { supabase } = await import('@/integrations/supabase/client');
      
      // For now, use localStorage to simulate premium status
      const storedPremium = localStorage.getItem('isPremium');
      const storedCount = localStorage.getItem('wallpaperCount');
      
      setIsPremium(storedPremium === 'true');
      setWallpaperCount(parseInt(storedCount || '0'));
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePremium = async () => {
    try {
      // For web/demo, just set premium status
      localStorage.setItem('isPremium', 'true');
      setIsPremium(true);
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    try {
      // For web/demo, reload premium status
      await loadPremiumStatus();
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };

  const incrementWallpaperCount = async () => {
    if (isPremium) return; // Premium users have unlimited

    const newCount = wallpaperCount + 1;
    localStorage.setItem('wallpaperCount', newCount.toString());
    setWallpaperCount(newCount);
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