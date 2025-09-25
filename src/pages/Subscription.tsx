import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { useSubscription } from '@/hooks/useSubscription';

const Subscription = () => {
  const { restorePurchases, loading } = useSubscription();

  return (
    <div className="container mx-auto px-4 py-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          onClick={restorePurchases}
          disabled={loading}
          className="text-sm"
        >
          {loading ? 'Restoring...' : 'Restore Purchases'}
        </Button>
      </div>

      <SubscriptionPlans />
    </div>
  );
};

export default Subscription;