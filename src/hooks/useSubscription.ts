import { useState, useEffect, useCallback } from 'react';
import { SubscriptionStatus, SubscriptionPlan, SubscriptionError } from '@/types/subscription';
import SubscriptionService from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    isTrialing: false,
    hasActiveSubscription: false
  });
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();

  const subscriptionService = SubscriptionService.getInstance();

  const loadSubscriptionData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load current subscription status
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);

      // Load available plans
      const plans = await subscriptionService.getAvailablePackages();
      setAvailablePlans(plans);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [subscriptionService, toast]);

  const purchaseSubscription = useCallback(async (packageIdentifier: string) => {
    try {
      setPurchasing(true);
      
      await subscriptionService.purchasePackage(packageIdentifier);
      
      // Reload subscription status after successful purchase
      await loadSubscriptionData();
      
      toast({
        title: "Welcome to Premium!",
        description: "Your subscription has been activated successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      const subscriptionError = error as SubscriptionError;
      
      toast({
        title: "Purchase Failed",
        description: subscriptionError.message || "Failed to complete purchase",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  }, [subscriptionService, loadSubscriptionData, toast]);

  const restorePurchases = useCallback(async () => {
    try {
      setLoading(true);
      
      await subscriptionService.restorePurchases();
      await loadSubscriptionData();
      
      toast({
        title: "Purchases Restored",
        description: "Your previous purchases have been restored successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Restore failed:', error);
      const subscriptionError = error as SubscriptionError;
      
      toast({
        title: "Restore Failed",
        description: subscriptionError.message || "Failed to restore purchases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [subscriptionService, loadSubscriptionData, toast]);

  // Initialize and load data on mount
  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  return {
    subscriptionStatus,
    availablePlans,
    loading,
    purchasing,
    purchaseSubscription,
    restorePurchases,
    refreshSubscriptionStatus: loadSubscriptionData
  };
};