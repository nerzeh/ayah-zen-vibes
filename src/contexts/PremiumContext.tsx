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
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setIsPremium(false);
        setWallpaperCount(0);
        return;
      }

      // Load premium status from database
      const { data: premiumData, error: premiumError } = await supabase
        .from('user_premium')
        .select('is_premium, wallpaper_count')
        .eq('user_id', user.id)
        .maybeSingle();

      if (premiumError) {
        console.error('Error loading premium status:', premiumError);
        return;
      }

      if (premiumData) {
        setIsPremium(premiumData.is_premium);
        setWallpaperCount(premiumData.wallpaper_count);
      } else {
        // Create premium record if it doesn't exist
        const { error: createError } = await supabase
          .from('user_premium')
          .insert({
            user_id: user.id,
            is_premium: false,
            wallpaper_count: 0
          });

        if (createError) {
          console.error('Error creating premium record:', createError);
        }
        
        setIsPremium(false);
        setWallpaperCount(0);
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePremium = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // TODO: Integrate with actual payment provider (Stripe, etc.)
      // For now, simulate payment verification
      // In production, this should verify payment with payment provider
      
      // This is a placeholder - replace with actual payment verification
      const paymentSuccessful = await simulatePaymentProcess();
      
      if (!paymentSuccessful) {
        throw new Error('Payment verification failed');
      }

      // Update premium status in database
      const { error: updateError } = await supabase
        .from('user_premium')
        .upsert({
          user_id: user.id,
          is_premium: true,
          purchase_date: new Date().toISOString()
        });

      if (updateError) {
        throw new Error('Failed to update premium status');
      }

      setIsPremium(true);
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  // Placeholder payment simulation - replace with real payment integration
  const simulatePaymentProcess = async (): Promise<boolean> => {
    // In production, this would:
    // 1. Open payment gateway (Stripe, etc.)
    // 2. Process payment
    // 3. Verify payment completion
    // 4. Return true only if payment was successful
    
    // For demo purposes, we'll just simulate failure to prevent bypassing
    return new Promise((resolve) => {
      // Always return false for demo to prevent premium bypass
      // In production, replace with actual payment verification
      setTimeout(() => resolve(false), 1000);
    });
  };

  const restorePurchases = async () => {
    try {
      // Reload premium status from database
      await loadPremiumStatus();
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };

  const incrementWallpaperCount = async () => {
    if (isPremium) return; // Premium users have unlimited

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const newCount = wallpaperCount + 1;

      // Update wallpaper count in database
      const { error: updateError } = await supabase
        .from('user_premium')
        .upsert({
          user_id: user.id,
          wallpaper_count: newCount
        });

      if (updateError) {
        throw new Error('Failed to update wallpaper count');
      }

      setWallpaperCount(newCount);
    } catch (error) {
      console.error('Error incrementing wallpaper count:', error);
      throw error;
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