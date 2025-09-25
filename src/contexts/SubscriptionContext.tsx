import React, { createContext, useContext, useEffect, useState } from 'react';
import SubscriptionService from '@/services/subscriptionService';
import { SubscriptionStatus } from '@/types/subscription';

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  isInitialized: boolean;
  initializeSubscriptions: (apiKey: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    isTrialing: false,
    hasActiveSubscription: false
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeSubscriptions = async (apiKey: string) => {
    try {
      const subscriptionService = SubscriptionService.getInstance();
      await subscriptionService.initialize(apiKey);
      
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize subscriptions:', error);
      setIsInitialized(true); // Set to true even on error to prevent loading loop
    }
  };

  const value = {
    subscriptionStatus,
    isInitialized,
    initializeSubscriptions
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};