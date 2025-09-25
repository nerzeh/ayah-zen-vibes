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

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync offline changes when back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineChanges();
    }
  }, [isOnline, offlineQueue.length]);

  // Apply global font size styles
  useEffect(() => {
    const existingStyle = document.getElementById('user-font-size-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'user-font-size-styles';
    styleElement.innerHTML = `
        /* Global font size styles based on user setting */
        html {
          font-size: ${settings.fontSize === 'small' ? '14px' : 
                      settings.fontSize === 'large' ? '18px' : 
                      settings.fontSize === 'extra-large' ? '20px' : 
                      '16px'};
        }
    `;
    document.head.appendChild(styleElement);

    return () => {
      const style = document.getElementById('user-font-size-styles');
      if (style) {
        style.remove();
      }
    };
  }, [settings.fontSize]);

  // Setup real-time subscription for settings updates
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
          filter: `user_id=eq.${user.id}`,
        },
        handleRemoteSettingsUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle remote settings updates with conflict resolution
  const handleRemoteSettingsUpdate = useCallback((payload: any) => {
    const remoteData = payload.new;
    
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
      translationStyle: (remoteData.translation_style as any) ?? defaultSettings.translationStyle,
      arabicTextSize: remoteData.arabic_text_size ?? defaultSettings.arabicTextSize,
      dateFormat: (remoteData.date_format as any) ?? defaultSettings.dateFormat,
      timeFormat: (remoteData.time_format as any) ?? defaultSettings.timeFormat,
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

  // Sync offline changes to server
  const syncOfflineChanges = async () => {
    if (!user || offlineQueue.length === 0) return;

    try {
      // Merge all offline changes
      const mergedUpdates = offlineQueue.reduce(
        (acc, item) => ({ ...acc, ...item.updates }),
        {}
      );

      await updateSettingsInDatabase(mergedUpdates);
      setOfflineQueue([]);
      
      toast({
        title: "Settings Synchronized",
        description: "Your offline changes have been synced",
      });
    } catch (error) {
      console.error('Error syncing offline changes:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync offline changes. Will retry automatically.",
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
      translation_style: updates.translationStyle,
      arabic_text_size: updates.arabicTextSize,
      date_format: updates.dateFormat,
      time_format: updates.timeFormat,
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
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      
      // Revert optimistic update on failure
      setSettings(prev => {
        const reverted = { ...prev };
        Object.keys(updates).forEach(key => {
          delete (reverted as any)[key];
        });
        return reverted;
      });
      
      toast({
        title: "Update Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Reset all settings to defaults
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