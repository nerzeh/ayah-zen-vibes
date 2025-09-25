import React from 'react';
import { Check, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/types/subscription';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionPlansProps {
  onSelectPlan?: (planId: string) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan }) => {
  const { availablePlans, purchasing, purchaseSubscription, subscriptionStatus } = useSubscription();

  const handlePurchase = async (packageIdentifier: string) => {
    try {
      await purchaseSubscription(packageIdentifier);
      onSelectPlan?.(packageIdentifier);
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const premiumFeatures = [
    'Complete library of 500+ Quranic verses',
    '20+ premium Islamic wallpaper backgrounds',
    'Auto-wallpaper daily scheduler',
    'Advanced text customization',
    'Multiple widget styles and sizes',
    'Prayer time integration',
    'Unlimited favorites sync',
    'Ad-free experience'
  ];

  if (subscriptionStatus.isPremium) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-4">
          <Crown className="h-12 w-12 text-primary mr-2" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">You're Premium!</h2>
        <p className="text-muted-foreground mb-4">
          Thank you for supporting Ayah Wallpapers
        </p>
        {subscriptionStatus.currentPlan && (
          <Badge variant="secondary" className="text-sm">
            {subscriptionStatus.currentPlan.title}
            {subscriptionStatus.isTrialing && " (Trial)"}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Unlock the complete Ayah Wallpapers experience
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {availablePlans.map((plan) => (
          <Card 
            key={plan.identifier} 
            className={`relative overflow-hidden transition-transform hover:scale-105 ${
              plan.period === 'annual' ? 'border-primary shadow-lg' : ''
            }`}
          >
            {plan.savings && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg">
                {plan.savings}
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                {plan.title}
              </CardTitle>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-primary">
                  {plan.price}
                </div>
                <p className="text-sm text-muted-foreground">
                  per {plan.period === 'monthly' ? 'month' : 'year'}
                </p>
                {plan.trialDuration > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {plan.trialDuration}-day free trial
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                {plan.description}
              </p>

              <Button 
                onClick={() => handlePurchase(plan.identifier)}
                disabled={purchasing}
                className="w-full mb-6"
                variant={plan.period === 'annual' ? 'default' : 'outline'}
              >
                {purchasing ? 'Processing...' : `Start ${plan.trialDuration}-Day Free Trial`}
              </Button>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Premium Features:</h4>
                <ul className="space-y-2">
                  {premiumFeatures.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                  {premiumFeatures.length > 4 && (
                    <li className="text-sm text-muted-foreground ml-6">
                      +{premiumFeatures.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          Subscriptions auto-renew. Cancel anytime in your device settings.
        </p>
        <p className="mt-1">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;