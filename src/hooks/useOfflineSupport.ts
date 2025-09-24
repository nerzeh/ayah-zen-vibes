import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Refetch queries when coming back online
      queryClient.refetchQueries();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for cached data
    checkOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  const checkOfflineData = async () => {
    try {
      // Check if we have cached verses
      const cachedVerses = queryClient.getQueryData(['verses']);
      const cachedFavorites = queryClient.getQueryData(['favorites']);
      const cachedWidgetData = localStorage.getItem('widgetData');
      const cachedDailyVerse = localStorage.getItem('dailyVerse');
      
      setHasOfflineData(!!(
        cachedVerses || 
        cachedFavorites || 
        cachedWidgetData || 
        cachedDailyVerse
      ));
    } catch (error) {
      console.error('Error checking offline data:', error);
    }
  };

  const cacheEssentialData = async () => {
    try {
      if ('caches' in window) {
        const cache = await caches.open('app-essential-v1');
        
        // Cache essential app routes
        const essentialUrls = [
          '/',
          '/library',
          '/favorites',
          '/customize',
          '/settings'
        ];
        
        await cache.addAll(essentialUrls);
      }
    } catch (error) {
      console.error('Failed to cache essential data:', error);
    }
  };

  const clearOfflineCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Clear local storage cache
      localStorage.removeItem('widgetData');
      localStorage.removeItem('dailyVerse');
      
      setHasOfflineData(false);
    } catch (error) {
      console.error('Failed to clear offline cache:', error);
    }
  };

  return {
    isOnline,
    hasOfflineData,
    cacheEssentialData,
    clearOfflineCache,
    checkOfflineData
  };
};