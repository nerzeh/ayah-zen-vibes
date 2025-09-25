import { notificationService } from './notificationService';
import { backgroundProcessor } from './backgroundProcessor';

export class AutomationManager {
  private static instance: AutomationManager;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AutomationManager {
    if (!AutomationManager.instance) {
      AutomationManager.instance = new AutomationManager();
    }
    return AutomationManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Automation Manager...');
      
      // Register service worker
      await this.registerServiceWorker();
      
      // Initialize notification service
      await notificationService.requestPermission();
      
      // Setup background sync if supported
      await this.setupBackgroundSync();
      
      // Initialize background processor
      backgroundProcessor; // Just access to initialize
      
      this.isInitialized = true;
      console.log('Automation Manager initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Automation Manager:', error);
    }
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker registered:', this.serviceWorkerRegistration);
        
        // Listen for service worker updates
        this.serviceWorkerRegistration.addEventListener('updatefound', () => {
          console.log('Service Worker update found');
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private async setupBackgroundSync(): Promise<void> {
    if (this.serviceWorkerRegistration && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        // Register background sync for daily updates
        const registration = this.serviceWorkerRegistration as any;
        await registration.sync?.register('daily-verse-update');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  public async requestDailyUpdate(): Promise<void> {
    if (this.serviceWorkerRegistration) {
      // Send message to service worker
      const messageChannel = new MessageChannel();
      
      this.serviceWorkerRegistration.active?.postMessage({
        type: 'DAILY_UPDATE'
      }, [messageChannel.port2]);
      
      // Also trigger background sync if available
      if ('sync' in ServiceWorkerRegistration.prototype) {
        try {
          const registration = this.serviceWorkerRegistration as any;
          await registration.sync?.register('daily-verse-update');
        } catch (error) {
          console.error('Background sync trigger failed:', error);
        }
      }
    }
  }

  public async scheduleNotification(title: string, body: string, delay: number): Promise<void> {
    // For immediate notifications, use the notification service
    if (delay <= 0) {
      await notificationService.sendNotification({ title, body });
      return;
    }

    // For delayed notifications, use setTimeout or service worker
    setTimeout(async () => {
      await notificationService.sendNotification({ title, body });
    }, delay);
  }

  public async enablePersistentNotifications(): Promise<boolean> {
    try {
      // Request persistent notification permission
      const permission = await notificationService.requestPermission();
      
      if (permission === 'granted' && this.serviceWorkerRegistration) {
        // Setup push subscription if needed
        // This would require a push service setup (Firebase, etc.)
        console.log('Persistent notifications enabled');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to enable persistent notifications:', error);
      return false;
    }
  }

  public async setWallpaperAutomation(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        // Check if we can write files or trigger downloads
        if ('showSaveFilePicker' in window) {
          console.log('File System Access API available for wallpaper automation');
        } else {
          console.log('Using download-based wallpaper automation');
        }
      }
      
      // Store automation preference
      localStorage.setItem('wallpaperAutomation', JSON.stringify({ enabled }));
      
    } catch (error) {
      console.error('Failed to set wallpaper automation:', error);
    }
  }

  public getServiceWorkerStatus(): {
    registered: boolean;
    active: boolean;
    backgroundSyncSupported: boolean;
    notificationPermission: NotificationPermission;
  } {
    return {
      registered: !!this.serviceWorkerRegistration,
      active: !!this.serviceWorkerRegistration?.active,
      backgroundSyncSupported: 'sync' in ServiceWorkerRegistration.prototype,
      notificationPermission: 'Notification' in window ? Notification.permission : 'denied'
    };
  }

  public async clearCache(): Promise<void> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('All caches cleared');
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

// Export singleton instance
export const automationManager = AutomationManager.getInstance();