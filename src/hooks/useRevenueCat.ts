import { useEffect, useState } from 'react';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { revenueCatService, SubscriptionInfo } from '@/services/revenueCatService';
import { Capacitor } from '@capacitor/core';

export const useRevenueCat = (userId?: string) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeRevenueCat();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConfigured && userId) {
      setAppUserId(userId);
    }
  }, [isConfigured, userId]);

  const initializeRevenueCat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiKey = Capacitor.getPlatform() === 'ios' 
        ? 'your_ios_api_key_here' // Replace with your actual iOS API key
        : 'your_android_api_key_here'; // Replace with your actual Android API key

      await revenueCatService.configure({ apiKey });
      setIsConfigured(true);

      // Load initial customer info
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize RevenueCat');
      console.error('RevenueCat initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setAppUserId = async (appUserId: string) => {
    try {
      await Purchases.logIn({ appUserID: appUserId });
      // Refresh customer info after setting user ID
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set user ID');
      console.error('Set user ID error:', err);
    }
  };

  const refreshCustomerInfo = async () => {
    if (!isConfigured) return;

    try {
      setError(null);
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh customer info');
      console.error('Refresh customer info error:', err);
    }
  };

  const syncPurchases = async () => {
    if (!isConfigured) return;

    try {
      setError(null);
      const info = await revenueCatService.syncPurchases();
      setCustomerInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync purchases');
      console.error('Sync purchases error:', err);
    }
  };

  return {
    isConfigured,
    customerInfo,
    isLoading,
    error,
    refreshCustomerInfo,
    syncPurchases,
    isNativePlatform: Capacitor.isNativePlatform(),
  };
};