import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Download, Smartphone, Zap } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PaywallDialog from '@/components/premium/PaywallDialog';
import PremiumBadge from '@/components/premium/PremiumBadge';

const PremiumSettings: React.FC = () => {
  const { isPremium, wallpaperCount, wallpaperLimit, purchasePremium } = usePremium();
  const { t } = useLanguage();
  const [showPaywall, setShowPaywall] = React.useState(false);

  return (
    <>
      <Card className="islamic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Premium Status
              </CardTitle>
              <CardDescription>
                Manage your premium subscription and features
              </CardDescription>
            </div>
            {isPremium && <PremiumBadge />}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="space-y-4">
            <h3 className="font-medium">Current Plan</h3>
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">
                    {isPremium ? 'Premium' : 'Free'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isPremium 
                      ? 'Enjoy unlimited wallpapers and all premium features'
                      : `${wallpaperCount}/${wallpaperLimit} wallpapers used`
                    }
                  </p>
                </div>
                {isPremium && (
                  <Crown className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-medium">Features</h3>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-primary" />
                  <span>Unlimited Wallpapers</span>
                </div>
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? "Active" : "Locked"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span>Home Screen Widget</span>
                </div>
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? "Active" : "Locked"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Ad-Free Experience</span>
                </div>
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? "Active" : "Locked"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isPremium && (
            <div className="pt-4 border-t">
              <Button 
                onClick={() => setShowPaywall(true)}
                className="w-full"
                size="lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Premium - $2.99
              </Button>
            </div>
          )}

          {isPremium && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Thank you for supporting Ayah Wallpapers! 🌟
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <PaywallDialog
        open={showPaywall}
        onOpenChange={setShowPaywall}
      />
    </>
  );
};

export default PremiumSettings;