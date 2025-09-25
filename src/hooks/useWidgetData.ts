import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WidgetConfig {
  enabled: boolean;
  updateFrequency: 'daily' | 'twice-daily' | 'hourly';
  size: '2x2' | '4x2' | '4x4';
  showArabic: boolean;
  showTranslation: boolean;
}

export interface WidgetVerseData {
  verse: {
    id: number;
    arabic_text: string;
    english_translation: string;
    surah_number: number;
    ayah_number: number;
    theme_category: string;
    formatted_reference: string;
  };
  theme: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    pattern: string;
  };
  metadata: {
    generatedAt: string;
    widgetSize: string;
    theme: string;
    cacheUntil: string;
  };
}

export const useWidgetConfig = () => {
  const getConfig = (): WidgetConfig => {
    const stored = localStorage.getItem('widgetConfig');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      enabled: false,
      updateFrequency: 'daily',
      size: '4x2',
      showArabic: true,
      showTranslation: true
    };
  };

  const setConfig = (config: WidgetConfig) => {
    localStorage.setItem('widgetConfig', JSON.stringify(config));
    // Trigger widget update if enabled
    if (config.enabled) {
      updateNativeWidget(config);
    }
  };

  return { getConfig, setConfig };
};

export const useWidgetVerseData = (config?: WidgetConfig) => {
  return useQuery({
    queryKey: ['widget-verse', config?.size],
    queryFn: async () => {
      const widgetConfig = config || JSON.parse(localStorage.getItem('widgetConfig') || '{}');
      
      const { data, error } = await supabase.functions.invoke('daily-verse-widget', {
        body: {
          size: widgetConfig.size || '4x2',
          maxLength: widgetConfig.size === '2x2' ? 30 : widgetConfig.size === '4x2' ? 80 : undefined
        }
      });

      if (error) throw error;
      return data as WidgetVerseData;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: config?.enabled !== false
  });
};

// Native widget update function
const updateNativeWidget = async (config: WidgetConfig) => {
  try {
    // For Capacitor apps, we would use native plugins to update widgets
    // This is a placeholder for the actual native implementation
    
    if ('serviceWorker' in navigator) {
      // Use Service Worker messaging for background sync
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({
          type: 'WIDGET_UPDATE',
          config: config
        });
      }
    }

    // Store widget data for native consumption
    const { data } = await supabase.functions.invoke('daily-verse-widget', {
      body: {
        size: config.size,
        maxLength: config.size === '2x2' ? 30 : config.size === '4x2' ? 80 : undefined
      }
    });

    if (data) {
      localStorage.setItem('widgetData', JSON.stringify(data));
      
      // Notify native layer about widget update (Capacitor specific)
      const capacitorWebView = (window as any).CapacitorWebView;
      if (capacitorWebView) {
        capacitorWebView.postMessage({
          type: 'WIDGET_UPDATE',
          data: data,
          config: config
        });
      }
    }
  } catch (error) {
    console.error('Failed to update native widget:', error);
  }
};

// Schedule automatic widget updates
export const scheduleWidgetUpdates = (config: WidgetConfig) => {
  if (!config.enabled) return;

  const intervals = {
    'daily': 24 * 60 * 60 * 1000,
    'twice-daily': 12 * 60 * 60 * 1000,
    'hourly': 60 * 60 * 1000
  };

  const interval = intervals[config.updateFrequency];
  
  // Clear existing interval
  const existingInterval = localStorage.getItem('widgetUpdateInterval');
  if (existingInterval) {
    clearInterval(parseInt(existingInterval));
  }

  // Set new interval
  const intervalId = setInterval(() => {
    updateNativeWidget(config);
  }, interval);

  localStorage.setItem('widgetUpdateInterval', intervalId.toString());
  
  // Initial update
  updateNativeWidget(config);
};

// Utility function to get widget data for native consumption
export const getWidgetDataForNative = (): WidgetVerseData | null => {
  const stored = localStorage.getItem('widgetData');
  return stored ? JSON.parse(stored) : null;
};