import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Smartphone, Zap, ExternalLink } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaywallDialog: React.FC<PaywallDialogProps> = ({ open, onOpenChange }) => {
  const { 
    purchasePackage, 
    restorePurchases, 
    currentOffering, 
    managementURL,
    isLoading: premiumLoading 
  } = usePremium();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('monthly');
  const isNative = Capacitor.isNativePlatform();

  const handlePurchase = async (packageId?: string) => {
    if (!isNative) {
      toast({
        title: 'Purchase Error',
        description: 'Purchases are only available on mobile devices',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const packageToPurchase = packageId || selectedPackage;
      await purchasePackage(packageToPurchase);
      toast({
        title: 'Premium Activated!',
        description: 'You now have unlimited access to all features.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: error instanceof Error ? error.message : 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      await restorePurchases();
      toast({
        title: 'Purchases Restored',
        description: 'Your premium features have been restored.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Restore Failed',
        description: error instanceof Error ? error.message : 'No previous purchases found.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = () => {
    if (managementURL) {
      window.open(managementURL, '_blank');
    }
  };

  const getPackageDisplayInfo = (packageType: 'monthly' | 'annual' | 'lifetime') => {
    if (!currentOffering) return null;
    
    const pkg = currentOffering[packageType];
    if (!pkg) return null;

    return {
      price: pkg.product?.priceString || '$2.99',
      identifier: pkg.identifier,
      title: packageType === 'monthly' ? 'Monthly' : 
             packageType === 'annual' ? 'Annual' : 'Lifetime',
      savings: packageType === 'annual' ? 'Save 50%' : 
               packageType === 'lifetime' ? 'Best Value' : null
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited wallpapers and exclusive features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Subscription Options */}
          {isNative && currentOffering && (
            <div className="space-y-4 my-6">
              <h3 className="font-semibold text-lg text-center">Choose Your Plan</h3>
              <div className="grid gap-3">
                {currentOffering.annual && (
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPackage === 'annual' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPackage('annual')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Annual Premium</h4>
                        <p className="text-sm text-muted-foreground">
                          {getPackageDisplayInfo('annual')?.price}/year
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Save 50%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentOffering.monthly && (
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPackage === 'monthly' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPackage('monthly')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Monthly Premium</h4>
                        <p className="text-sm text-muted-foreground">
                          {getPackageDisplayInfo('monthly')?.price}/month
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentOffering.lifetime && (
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPackage === 'lifetime' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPackage('lifetime')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Remove Ads Lifetime</h4>
                        <p className="text-sm text-muted-foreground">
                          {getPackageDisplayInfo('lifetime')?.price} once
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Best Value
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 my-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Free Plan
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  5 wallpaper downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Basic customization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Daily verses
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium Plan
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Unlimited wallpaper downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Home screen widget</span>
                  <Smartphone className="h-4 w-4 text-blue-500" />
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Ad-free experience</span>
                  <Zap className="h-4 w-4 text-purple-500" />
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Advanced customization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Priority support
                </li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isNative ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleRestore}
                disabled={isLoading || premiumLoading}
              >
                Restore Purchases
              </Button>
              {managementURL && (
                <Button 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Manage Subscription
                </Button>
              )}
              <Button 
                onClick={() => handlePurchase()}
                disabled={isLoading || premiumLoading || !currentOffering}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Processing...' : 
                 !currentOffering ? 'Loading...' :
                 `Subscribe ${selectedPackage === 'annual' ? 'Annual' : 
                              selectedPackage === 'lifetime' ? 'Lifetime' : 'Monthly'}`}
              </Button>
            </>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              <p>Premium features are available on mobile devices.</p>
              <p className="text-sm mt-2">Download our app from the App Store or Google Play.</p>
            </div>
          )}
        </DialogFooter>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center">
          {isNative ? 'Subscription auto-renews • Cancel anytime' : 'One-time purchase • No subscription • Lifetime access'}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallDialog;