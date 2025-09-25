import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  // General settings
  darkMode: boolean;
  language: string;
  
  // Notification settings
  dailyNotifications: boolean;
  prayerReminders: boolean;
  
  // Daily wallpaper settings
  dailyUpdates: boolean;
  autoWallpaper: boolean;
  
  // Automation settings
  automationEnabled: boolean;
  updateTime: string;
  frequency: 'daily' | 'weekly' | 'manual';
  automationNotifications: boolean;
  
  // Accessibility settings
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  
  // Language & Text settings
  translationStyle: 'literal' | 'interpretive' | 'simplified';
  arabicTextSize: number;
  dateFormat: 'gregorian' | 'hijri' | 'both';
  timeFormat: '12h' | '24h';
}

interface OfflineSettingsUpdate {
  updates: Partial<UserSettings>;
  timestamp: number;
}

const defaultSettings: UserSettings = {
  darkMode: false,
  language: 'en',
  dailyNotifications: true,
  prayerReminders: false,
  dailyUpdates: true,
  autoWallpaper: false,
  automationEnabled: false,
  updateTime: '09:00',
  frequency: 'daily',
  automationNotifications: true,
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  translationStyle: 'interpretive',
  arabicTextSize: 18,
  dateFormat: 'gregorian',
  timeFormat: '12h',
};

export const useEnhancedUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineSettingsUpdate[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineChanges();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time subscription for settings changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_settings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          handleRemoteSettingsUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle remote settings updates (conflict resolution)
  const handleRemoteSettingsUpdate = useCallback((remoteData: any) => {
    const remoteSettings = {
      darkMode: remoteData.dark_mode ?? defaultSettings.darkMode,
      language: remoteData.language ?? defaultSettings.language,
      dailyNotifications: remoteData.daily_notifications ?? defaultSettings.dailyNotifications,
      prayerReminders: remoteData.prayer_reminders ?? defaultSettings.prayerReminders,
      dailyUpdates: remoteData.daily_updates ?? defaultSettings.dailyUpdates,
      autoWallpaper: remoteData.auto_wallpaper ?? defaultSettings.autoWallpaper,
      automationEnabled: remoteData.automation_enabled ?? defaultSettings.automationEnabled,
      updateTime: remoteData.update_time ?? defaultSettings.updateTime,
      frequency: (remoteData.frequency as any) ?? defaultSettings.frequency,
      automationNotifications: remoteData.automation_notifications ?? defaultSettings.automationNotifications,
      fontSize: (remoteData.font_size as any) ?? defaultSettings.fontSize,
      highContrast: remoteData.high_contrast ?? defaultSettings.highContrast,
      reducedMotion: remoteData.reduced_motion ?? defaultSettings.reducedMotion,
      screenReaderMode: remoteData.screen_reader_mode ?? defaultSettings.screenReaderMode,
    };

    const remoteUpdateTime = new Date(remoteData.updated_at);
    
    // Conflict resolution: use server timestamp as source of truth
    if (!lastSyncTime || remoteUpdateTime > lastSyncTime) {
      setSettings(remoteSettings);
      setLastSyncTime(remoteUpdateTime);
      
      toast({
        title: "Settings Updated",
        description: "Your settings have been synchronized across devices",
      });
    }
  }, [lastSyncTime, toast]);

  // Load settings from database
  useEffect(() => {
    if (!user) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading settings:', error);
          return;
        }

        if (data) {
          const loadedSettings = {
            darkMode: data.dark_mode ?? defaultSettings.darkMode,
            language: data.language ?? defaultSettings.language,
            dailyNotifications: data.daily_notifications ?? defaultSettings.dailyNotifications,
            prayerReminders: data.prayer_reminders ?? defaultSettings.prayerReminders,
            dailyUpdates: data.daily_updates ?? defaultSettings.dailyUpdates,
            autoWallpaper: data.auto_wallpaper ?? defaultSettings.autoWallpaper,
            automationEnabled: data.automation_enabled ?? defaultSettings.automationEnabled,
            updateTime: data.update_time ?? defaultSettings.updateTime,
            frequency: (data.frequency as any) ?? defaultSettings.frequency,
            automationNotifications: data.automation_notifications ?? defaultSettings.automationNotifications,
            fontSize: (data.font_size as any) ?? defaultSettings.fontSize,
            highContrast: data.high_contrast ?? defaultSettings.highContrast,
            reducedMotion: data.reduced_motion ?? defaultSettings.reducedMotion,
            screenReaderMode: data.screen_reader_mode ?? defaultSettings.screenReaderMode,
            translationStyle: (data.translation_style as any) ?? defaultSettings.translationStyle,
            arabicTextSize: data.arabic_text_size ?? defaultSettings.arabicTextSize,
            dateFormat: (data.date_format as any) ?? defaultSettings.dateFormat,
            timeFormat: (data.time_format as any) ?? defaultSettings.timeFormat,
          };
          
          setSettings(loadedSettings);
          setLastSyncTime(new Date(data.updated_at));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Sync offline changes when coming back online
  const syncOfflineChanges = async () => {
    if (!user || offlineQueue.length === 0) return;

    try {
      // Merge all offline updates
      const mergedUpdates = offlineQueue.reduce((acc, update) => ({
        ...acc,
        ...update.updates
      }), {});

      await updateSettingsInDatabase(mergedUpdates);
      setOfflineQueue([]);
      
      toast({
        title: "Sync Complete",
        description: "Your settings have been synchronized",
      });
    } catch (error) {
      toast({
        title: "Sync Failed", 
        description: "Some settings couldn't be synchronized. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Update settings in database
  const updateSettingsInDatabase = async (updates: Partial<UserSettings>) => {
    if (!user) return;

    const dbUpdates = {
      dark_mode: updates.darkMode,
      language: updates.language,
      daily_notifications: updates.dailyNotifications,
      prayer_reminders: updates.prayerReminders,
      daily_updates: updates.dailyUpdates,
      auto_wallpaper: updates.autoWallpaper,
      automation_enabled: updates.automationEnabled,
      update_time: updates.updateTime,
      frequency: updates.frequency,
      automation_notifications: updates.automationNotifications,
      font_size: updates.fontSize,
      high_contrast: updates.highContrast,
      reduced_motion: updates.reducedMotion,
      screen_reader_mode: updates.screenReaderMode,
    };

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(dbUpdates).filter(([_, value]) => value !== undefined)
    );

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        ...cleanUpdates,
      });

    if (error) throw error;
    setLastSyncTime(new Date());
  };

  // Update settings with offline support and optimistic updates
  const updateSettings = async (updates: Partial<UserSettings>) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, ...updates }));

    if (!user) return;

    try {
      if (!isOnline) {
        // Queue for offline sync
        setOfflineQueue(prev => [...prev, {
          updates,
          timestamp: Date.now()
        }]);
        
        toast({
          title: "Settings Saved Locally",
          description: "Changes will sync when you're back online",
        });
        return;
      }

      await updateSettingsInDatabase(updates);
      
    } catch (error) {
      // Revert optimistic update on error
      setSettings(prev => {
        const reverted = { ...prev };
        Object.keys(updates).forEach(key => {
          const defaultValue = defaultSettings[key as keyof UserSettings];
          if (defaultValue !== undefined) {
            (reverted as any)[key] = defaultValue;
          }
        });
        return reverted;
      });

      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    await updateSettings(defaultSettings);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    loading,
    isAuthenticated: !!user,
    isOnline,
    hasOfflineChanges: offlineQueue.length > 0,
    syncOfflineChanges,
    lastSyncTime,
  };
};