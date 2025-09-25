import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Crown, X, Smartphone, Download, Palette } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaywallDialog: React.FC<PaywallDialogProps> = ({ open, onOpenChange }) => {
  const { purchasePremium, restorePurchases } = usePremium();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handlePurchase = async () => {
    try {
      await purchasePremium();
      toast({
        title: "Premium Activated!",
        description: "You now have unlimited access to all features.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      toast({
        title: "Purchases Restored",
        description: "Your premium features have been restored.",
      });
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "No previous purchases found.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto bg-gradient-to-br from-background to-background/95 border-primary/20">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary p-3 rounded-full">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Unlock unlimited wallpapers and exclusive features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Free vs Premium Comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* Free Plan */}
            <Card className="p-4 border-muted">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Free</h3>
                <p className="text-2xl font-bold text-muted-foreground mb-3">$0</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>5 wallpapers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Ads included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>No widget</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-4 border-primary bg-gradient-to-br from-primary/5 to-secondary/5 relative">
              <div className="absolute -top-2 -right-2 bg-gradient-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                PREMIUM
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Premium</h3>
                <p className="text-2xl font-bold text-primary mb-3">$2.99</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Unlimited wallpapers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>No ads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Home screen widget</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Premium Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="bg-gradient-primary p-2 rounded-full">
                <Download className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Unlimited Downloads</h4>
                <p className="text-sm text-muted-foreground">Download as many wallpapers as you want</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="bg-gradient-elegant p-2 rounded-full">
                <Smartphone className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Home Screen Widget</h4>
                <p className="text-sm text-muted-foreground">Daily verses right on your home screen</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="bg-gradient-secondary p-2 rounded-full">
                <Palette className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Ad-Free Experience</h4>
                <p className="text-sm text-muted-foreground">Enjoy the app without any interruptions</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handlePurchase}
              className="w-full bg-gradient-primary hover:shadow-glow h-12 text-lg font-semibold"
            >
              <Crown className="mr-2 h-5 w-5" />
              Upgrade to Premium - $2.99
            </Button>
            
            <Button 
              onClick={handleRestore}
              variant="outline"
              className="w-full"
            >
              Restore Purchases
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center">
            One-time purchase • No subscription • Lifetime access
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallDialog;