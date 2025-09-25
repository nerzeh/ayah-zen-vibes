import { Purchases, PurchasesOffering, CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-capacitor';

export interface RevenueCatConfig {
  apiKey: string;
  appUserId?: string;
}

export interface SubscriptionInfo {
  isPremium: boolean;
  hasNoAds: boolean;
  activeSubscriptions: string[];
  nonSubscriptionTransactions: string[];
  entitlements: {
    pro?: boolean;
    no_ads?: boolean;
  };
  managementURL?: string;
}

export interface OfferingData {
  identifier: string;
  serverDescription: string;
  metadata?: { [key: string]: any };
  availablePackages: PurchasesPackage[];
  lifetime?: PurchasesPackage;
  monthly?: PurchasesPackage;
  annual?: PurchasesPackage;
}

class RevenueCatService {
  private isConfigured = false;

  async configure(config: RevenueCatConfig): Promise<void> {
    try {
      await Purchases.configure({
        apiKey: config.apiKey,
        appUserID: config.appUserId,
      });
      this.isConfigured = true;
      console.log('RevenueCat configured successfully');
    } catch (error) {
      console.error('Failed to configure RevenueCat:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<SubscriptionInfo> {
    if (!this.isConfigured) {
      throw new Error('RevenueCat not configured');
    }

    try {
      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
      
      return {
        isPremium: false, // Simplified for demo
        hasNoAds: false,
        activeSubscriptions: [],
        nonSubscriptionTransactions: [],
        entitlements: {
          pro: false,
          no_ads: false,
        },
        managementURL: undefined,
      };
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<OfferingData | null> {
    if (!this.isConfigured) {
      throw new Error('RevenueCat not configured');
    }

    try {
      const offerings = await Purchases.getOfferings();
      return null; // Simplified for now
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<SubscriptionInfo> {
    if (!this.isConfigured) {
      throw new Error('RevenueCat not configured');
    }

    try {
      const result = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      return {
        isPremium: true,
        hasNoAds: true,
        activeSubscriptions: [],
        nonSubscriptionTransactions: [],
        entitlements: {
          pro: true,
          no_ads: true,
        },
        managementURL: undefined,
      };
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<SubscriptionInfo> {
    if (!this.isConfigured) {
      throw new Error('RevenueCat not configured');
    }

    try {
      await Purchases.restorePurchases();
      return await this.getCustomerInfo();
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw error;
    }
  }

  async syncPurchases(): Promise<SubscriptionInfo> {
    if (!this.isConfigured) {
      throw new Error('RevenueCat not configured');
    }

    try {
      await Purchases.syncPurchases();
      return await this.getCustomerInfo();
    } catch (error) {
      console.error('Sync purchases failed:', error);
      throw error;
    }
  }
}

export const revenueCatService = new RevenueCatService();