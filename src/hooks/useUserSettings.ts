import { useState, useEffect } from 'react';
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
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

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
          setSettings({
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
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Update settings in database
  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) {
      setSettings(prev => ({ ...prev, ...updates }));
      return;
    }

    try {
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

      if (error) {
        console.error('Error updating settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setSettings(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    settings,
    updateSettings,
    loading,
    isAuthenticated: !!user,
  };
};