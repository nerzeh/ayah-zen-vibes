import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  showButton?: boolean;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ 
  children, 
  featureName, 
  description,
  showButton = true 
}) => {
  const { subscriptionStatus, loading } = useSubscription();
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If user has premium access, show the content
  if (subscriptionStatus.isPremium) {
    return <>{children}</>;
  }

  // Show premium gate
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Crown className="h-12 w-12 text-muted-foreground" />
            <Lock className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          Premium Feature
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {featureName}
        </h3>
        
        {description && (
          <p className="text-muted-foreground mb-6">
            {description}
          </p>
        )}
        
        <p className="text-sm text-muted-foreground mb-6">
          Upgrade to Premium to unlock this feature and enjoy the complete Ayah Wallpapers experience.
        </p>

        {showButton && (
          <Button 
            onClick={() => navigate('/subscription')}
            className="w-full"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PremiumGate;