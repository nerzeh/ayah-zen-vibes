export interface SubscriptionPlan {
  identifier: string;
  title: string;
  price: string;
  priceValue: number;
  currency: string;
  period: 'monthly' | 'annual';
  savings?: string;
  trialDuration: number;
  description: string;
}

export interface Entitlement {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  periodType: string;
  latestPurchaseDate: string;
  originalPurchaseDate: string;
  expirationDate?: string;
  store: string;
  productIdentifier: string;
  isSandbox: boolean;
}

export interface CustomerInfo {
  activeSubscriptions: Set<string>;
  allPurchasedProductIdentifiers: Set<string>;
  entitlements: {
    active: { [key: string]: Entitlement };
    all: { [key: string]: Entitlement };
  };
  firstSeen: string;
  latestExpirationDate?: string;
  originalPurchaseDate?: string;
  requestDate: string;
  originalApplicationVersion?: string;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  isTrialing: boolean;
  hasActiveSubscription: boolean;
  currentPlan?: SubscriptionPlan;
  expirationDate?: Date;
  trialEndDate?: Date;
}

export class SubscriptionError extends Error {
  public code: string;
  public underlyingErrorMessage?: string;

  constructor(options: {
    code: string;
    message: string;
    underlyingErrorMessage?: string;
  }) {
    super(options.message);
    this.name = 'SubscriptionError';
    this.code = options.code;
    this.underlyingErrorMessage = options.underlyingErrorMessage;
  }
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isPremiumOnly: boolean;
}