import Purchases, { 
  PurchasesPackage, 
  CustomerInfo as RCCustomerInfo,
  PurchasesOfferings 
} from 'react-native-purchases';
import { SubscriptionPlan, SubscriptionStatus, SubscriptionError, CustomerInfo } from '@/types/subscription';

class SubscriptionService {
  private static instance: SubscriptionService;
  private isInitialized = false;

  // Product IDs as specified
  public static readonly PRODUCT_IDS = {
    MONTHLY: 'ayah_monthly_499',
    ANNUAL: 'ayah_annual_3999'
  } as const;

  // Entitlements
  public static readonly ENTITLEMENTS = {
    PREMIUM: 'premium'
  } as const;

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async initialize(revenueCatApiKey: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Purchases.configure({ apiKey: revenueCatApiKey });
      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw new SubscriptionError({
        code: 'INITIALIZATION_FAILED',
        message: 'Failed to initialize subscription service',
        underlyingErrorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.parseCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return {
        isPremium: false,
        isTrialing: false,
        hasActiveSubscription: false
      };
    }
  }

  async getAvailablePackages(): Promise<SubscriptionPlan[]> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        throw new Error('No current offering available');
      }

      const plans: SubscriptionPlan[] = [];
      
      // Monthly plan
      const monthlyPackage = currentOffering.availablePackages.find(
        pkg => pkg.product.identifier === SubscriptionService.PRODUCT_IDS.MONTHLY
      );
      
      if (monthlyPackage) {
        plans.push({
          identifier: monthlyPackage.identifier,
          title: 'Monthly Premium',
          price: monthlyPackage.product.priceString,
          priceValue: 4.99,
          currency: 'USD',
          period: 'monthly',
          trialDuration: 7,
          description: 'Complete access to all premium features'
        });
      }

      // Annual plan
      const annualPackage = currentOffering.availablePackages.find(
        pkg => pkg.product.identifier === SubscriptionService.PRODUCT_IDS.ANNUAL
      );
      
      if (annualPackage) {
        plans.push({
          identifier: annualPackage.identifier,
          title: 'Annual Premium',
          price: annualPackage.product.priceString,
          priceValue: 39.99,
          currency: 'USD',
          period: 'annual',
          savings: 'Save 33%',
          trialDuration: 7,
          description: 'Complete access to all premium features - Best Value!'
        });
      }

      return plans;
    } catch (error) {
      console.error('Failed to get available packages:', error);
      throw new SubscriptionError({
        code: 'PACKAGES_FETCH_FAILED',
        message: 'Failed to load subscription plans',
        underlyingErrorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async purchasePackage(packageIdentifier: string): Promise<CustomerInfo> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        throw new Error('No current offering available');
      }

      const packageToPurchase = currentOffering.availablePackages.find(
        pkg => pkg.identifier === packageIdentifier
      );

      if (!packageToPurchase) {
        throw new Error('Package not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return this.transformCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Purchase failed:', error);
      throw new SubscriptionError({
        code: 'PURCHASE_FAILED',
        message: 'Failed to complete purchase',
        underlyingErrorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return this.transformCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw new SubscriptionError({
        code: 'RESTORE_FAILED',
        message: 'Failed to restore purchases',
        underlyingErrorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.transformCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw new SubscriptionError({
        code: 'CUSTOMER_INFO_FAILED',
        message: 'Failed to get customer information',
        underlyingErrorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private parseCustomerInfo(customerInfo: RCCustomerInfo): SubscriptionStatus {
    const premiumEntitlement = customerInfo.entitlements.active[SubscriptionService.ENTITLEMENTS.PREMIUM];
    
    const isPremium = !!premiumEntitlement;
    const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;
    
    // Check if user is in trial period
    const isTrialing = premiumEntitlement ? 
      new Date(premiumEntitlement.originalPurchaseDate).getTime() > (Date.now() - 7 * 24 * 60 * 60 * 1000) : 
      false;

    let currentPlan: SubscriptionPlan | undefined;
    let expirationDate: Date | undefined;

    if (premiumEntitlement) {
      expirationDate = premiumEntitlement.expirationDate ? new Date(premiumEntitlement.expirationDate) : undefined;
      
      // Determine current plan based on product identifier
      if (premiumEntitlement.productIdentifier === SubscriptionService.PRODUCT_IDS.MONTHLY) {
        currentPlan = {
          identifier: 'monthly',
          title: 'Monthly Premium',
          price: '$4.99',
          priceValue: 4.99,
          currency: 'USD',
          period: 'monthly',
          trialDuration: 7,
          description: 'Complete access to all premium features'
        };
      } else if (premiumEntitlement.productIdentifier === SubscriptionService.PRODUCT_IDS.ANNUAL) {
        currentPlan = {
          identifier: 'annual',
          title: 'Annual Premium',
          price: '$39.99',
          priceValue: 39.99,
          currency: 'USD',
          period: 'annual',
          savings: 'Save 33%',
          trialDuration: 7,
          description: 'Complete access to all premium features - Best Value!'
        };
      }
    }

    return {
      isPremium,
      isTrialing,
      hasActiveSubscription,
      currentPlan,
      expirationDate,
      trialEndDate: isTrialing && premiumEntitlement ? 
        new Date(new Date(premiumEntitlement.originalPurchaseDate).getTime() + 7 * 24 * 60 * 60 * 1000) : 
        undefined
    };
  }

  private transformCustomerInfo(rcCustomerInfo: RCCustomerInfo): CustomerInfo {
    return {
      activeSubscriptions: new Set(Array.from(rcCustomerInfo.activeSubscriptions)),
      allPurchasedProductIdentifiers: new Set(Array.from(rcCustomerInfo.allPurchasedProductIdentifiers)),
      entitlements: {
        active: Object.fromEntries(
          Object.entries(rcCustomerInfo.entitlements.active).map(([key, entitlement]) => [
            key,
            {
              identifier: entitlement.identifier,
              isActive: entitlement.isActive,
              willRenew: entitlement.willRenew,
              periodType: entitlement.periodType,
              latestPurchaseDate: entitlement.latestPurchaseDate,
              originalPurchaseDate: entitlement.originalPurchaseDate,
              expirationDate: entitlement.expirationDate,
              store: entitlement.store,
              productIdentifier: entitlement.productIdentifier,
              isSandbox: entitlement.isSandbox
            }
          ])
        ),
        all: Object.fromEntries(
          Object.entries(rcCustomerInfo.entitlements.all).map(([key, entitlement]) => [
            key,
            {
              identifier: entitlement.identifier,
              isActive: entitlement.isActive,
              willRenew: entitlement.willRenew,
              periodType: entitlement.periodType,
              latestPurchaseDate: entitlement.latestPurchaseDate,
              originalPurchaseDate: entitlement.originalPurchaseDate,
              expirationDate: entitlement.expirationDate,
              store: entitlement.store,
              productIdentifier: entitlement.productIdentifier,
              isSandbox: entitlement.isSandbox
            }
          ])
        )
      },
      firstSeen: rcCustomerInfo.firstSeen,
      latestExpirationDate: rcCustomerInfo.latestExpirationDate,
      originalPurchaseDate: rcCustomerInfo.originalPurchaseDate,
      requestDate: rcCustomerInfo.requestDate,
      originalApplicationVersion: rcCustomerInfo.originalApplicationVersion
    };
  }
}

export default SubscriptionService;