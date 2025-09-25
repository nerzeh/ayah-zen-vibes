import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WallpaperGenerator, getDeviceScreenDimensions } from '@/lib/wallpaperEngine';
import { Verse } from '@/hooks/useVerses';

export interface AutomationSettings {
  enabled: boolean;
  updateTime: string; // HH:mm format
  autoWallpaper: boolean;
  notifications: boolean;
  frequency: 'daily' | 'weekly' | 'manual';
}

export interface DailyAutomationState {
  isProcessing: boolean;
  lastUpdate: string | null;
  nextScheduled: string | null;
  error: string | null;
}

export const useDailyAutomation = () => {
  const [settings, setSettings] = useState<AutomationSettings>(() => {
    const stored = localStorage.getItem('automationSettings');
    return stored ? JSON.parse(stored) : {
      enabled: false,
      updateTime: '06:00',
      autoWallpaper: false,
      notifications: true,
      frequency: 'daily'
    };
  });

  const [state, setState] = useState<DailyAutomationState>(() => {
    const stored = localStorage.getItem('automationState');
    return stored ? JSON.parse(stored) : {
      isProcessing: false,
      lastUpdate: null,
      nextScheduled: null,
      error: null
    };
  });

  const { toast } = useToast();

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('automationSettings', JSON.stringify(settings));
  }, [settings]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('automationState', JSON.stringify(state));
  }, [state]);

  // Request permissions when settings change
  useEffect(() => {
    if (settings.notifications || settings.autoWallpaper) {
      requestPermissions();
    }
  }, [settings.notifications, settings.autoWallpaper]);

  // Setup automation when enabled
  useEffect(() => {
    if (settings.enabled) {
      setupDailySchedule();
    } else {
      clearSchedule();
    }
  }, [settings.enabled, settings.updateTime, settings.frequency]);

  const requestPermissions = async () => {
    try {
      // Request notification permission
      if (settings.notifications && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast({
            title: "Permission required",
            description: "Please enable notifications to receive daily verse updates",
            variant: "destructive"
          });
        }
      }

      // Note: Wallpaper permission is handled at the OS level
      if (settings.autoWallpaper) {
        toast({
          title: "Auto-wallpaper enabled",
          description: "New wallpapers will be downloaded to your device for easy setting",
        });
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const setupDailySchedule = () => {
    const now = new Date();
    const [hours, minutes] = settings.updateTime.split(':').map(Number);
    
    let scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Adjust for frequency
    if (settings.frequency === 'weekly') {
      const daysUntilNext = 7 - ((now.getTime() - scheduledTime.getTime()) / (1000 * 60 * 60 * 24)) % 7;
      scheduledTime.setDate(scheduledTime.getDate() + Math.floor(daysUntilNext));
    }

    const timeUntilUpdate = scheduledTime.getTime() - now.getTime();
    
    setState(prev => ({
      ...prev,
      nextScheduled: scheduledTime.toISOString(),
      error: null
    }));

    // Clear existing timeout
    const existingTimeout = localStorage.getItem('automationTimeout');
    if (existingTimeout) {
      clearTimeout(parseInt(existingTimeout));
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      processDailyUpdate();
    }, timeUntilUpdate);

    localStorage.setItem('automationTimeout', timeoutId.toString());

    console.log(`Daily automation scheduled for ${scheduledTime.toLocaleString()}`);
  };

  const clearSchedule = () => {
    const existingTimeout = localStorage.getItem('automationTimeout');
    if (existingTimeout) {
      clearTimeout(parseInt(existingTimeout));
      localStorage.removeItem('automationTimeout');
    }

    setState(prev => ({
      ...prev,
      nextScheduled: null
    }));
  };

  const processDailyUpdate = async () => {
    if (state.isProcessing) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Get daily verse
      const { data: verses } = await supabase
        .from('verses')
        .select('*')
        .order('id');

      if (!verses || verses.length === 0) {
        throw new Error('No verses available');
      }

      // Select verse based on current date for consistency
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
      const selectedVerse = verses[dayOfYear % verses.length] as Verse;

      // Cache the daily verse
      localStorage.setItem('dailyVerse', JSON.stringify({
        verse: selectedVerse,
        date: today.toDateString()
      }));

      // Generate wallpaper in background if auto-wallpaper is enabled
      if (settings.autoWallpaper) {
        await generateAndCacheWallpaper(selectedVerse);
      }

      // Send notification
      if (settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Daily Verse Ready', {
          body: `Today's verse is from Surah ${selectedVerse.surah_number}:${selectedVerse.ayah_number}`,
          icon: '/favicon.ico',
          tag: 'daily-verse'
        });
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        lastUpdate: today.toISOString(),
        error: null
      }));

      // Setup next update
      if (settings.enabled) {
        setupDailySchedule();
      }

    } catch (error) {
      console.error('Daily update failed:', error);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Update failed'
      }));

      toast({
        title: "Daily update failed",
        description: "Failed to process daily verse update. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateAndCacheWallpaper = async (verse: Verse) => {
    try {
      const generator = new WallpaperGenerator();
      const dimensions = getDeviceScreenDimensions();
      
      const wallpaperBlob = await generator.generateWallpaper(verse, {
      backgroundStyle: 'nature',
      colorScheme: 'nature',
        width: dimensions.width,
        height: dimensions.height
      });

      // Create download link for auto-wallpaper
      const url = URL.createObjectURL(wallpaperBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `daily-verse-${new Date().toISOString().split('T')[0]}.png`;
      
      // Auto-download if supported
      if (document.body) {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Wallpaper ready",
          description: "Your daily wallpaper has been downloaded and is ready to set",
        });
      }

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Wallpaper generation failed:', error);
    }
  };

  const updateSettings = (newSettings: Partial<AutomationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const manualUpdate = async () => {
    await processDailyUpdate();
  };

  const getDailyVerse = (): { verse: Verse; date: string } | null => {
    const stored = localStorage.getItem('dailyVerse');
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const today = new Date().toDateString();
    
    // Return cached verse if it's from today
    if (data.date === today) {
      return data;
    }
    
    return null;
  };

  return {
    settings,
    state,
    updateSettings,
    manualUpdate,
    getDailyVerse,
    requestPermissions
  };
};