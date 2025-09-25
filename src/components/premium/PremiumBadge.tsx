import React from 'react';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PremiumBadgeProps {
  className?: string;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className = '' }) => {
  return (
      <Badge 
        className="bg-primary text-primary-foreground border-0"
      >
      <Crown className="h-3 w-3 mr-1" />
      Premium
    </Badge>
  );
};

export default PremiumBadge;