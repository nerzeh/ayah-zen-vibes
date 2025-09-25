import React from 'react';
import { X, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFreeTierLimits } from '@/hooks/usePremiumFeature';
import { useNavigate } from 'react-router-dom';

interface AdBannerProps {
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  className = '', 
  onClose, 
  showCloseButton = false 
}) => {
  const { shouldShowAds } = useFreeTierLimits();
  const navigate = useNavigate();

  if (!shouldShowAds) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-primary bg-muted/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Upgrade to Premium
              </p>
              <p className="text-xs text-muted-foreground">
                Remove ads and unlock all features
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              onClick={() => navigate('/subscription')}
              className="text-xs px-3 py-1 h-auto"
            >
              Upgrade
            </Button>
            
            {showCloseButton && onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdBanner;