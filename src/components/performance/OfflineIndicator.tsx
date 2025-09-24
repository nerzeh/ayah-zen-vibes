import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert && isOnline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
      {showAlert && (
        <Alert className={`pointer-events-auto animate-fade-in ${
          isOnline 
            ? 'border-success/20 bg-success/10' 
            : 'border-warning/20 bg-warning/10'
        }`}>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-success" />
            ) : (
              <WifiOff className="h-4 w-4 text-warning" />
            )}
            <AlertDescription>
              {isOnline 
                ? 'You\'re back online! All features are available.'
                : 'You\'re offline. Some features may be limited.'
              }
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {!isOnline && !showAlert && (
        <div className="flex justify-end">
          <Badge variant="outline" className="border-warning/20 text-warning bg-warning/10">
            <CloudOff className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;