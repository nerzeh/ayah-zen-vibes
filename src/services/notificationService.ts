import { Verse } from '@/hooks/useVerses';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  badge?: string;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.initializeServiceWorker();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        console.log('Service Worker ready for notifications');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  public async sendNotification(options: NotificationOptions): Promise<void> {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      // Use Service Worker for better notification management if available
      if (this.registration && this.registration.showNotification) {
        await this.registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/favicon.ico',
          badge: options.badge || '/favicon.ico',
          tag: options.tag || 'default',
          data: options.data,
          requireInteraction: false,
          silent: false
        });
      } else {
        // Fallback to regular notifications
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/favicon.ico',
          tag: options.tag || 'default',
          data: options.data
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  public async sendDailyVerseNotification(verse: Verse): Promise<void> {
    await this.sendNotification({
      title: 'Daily Verse Ready 📖',
      body: `Today's verse is from Surah ${verse.surah_number}:${verse.ayah_number}`,
      icon: '/favicon.ico',
      tag: 'daily-verse',
      data: {
        type: 'daily-verse',
        verse: verse,
        timestamp: Date.now()
      }
    });
  }

  public async sendWallpaperReadyNotification(): Promise<void> {
    await this.sendNotification({
      title: 'Wallpaper Ready 🎨',
      body: 'Your daily Islamic wallpaper has been generated and downloaded',
      icon: '/favicon.ico',
      tag: 'wallpaper-ready',
      data: {
        type: 'wallpaper-ready',
        timestamp: Date.now()
      }
    });
  }

  public async sendReminderNotification(message: string): Promise<void> {
    await this.sendNotification({
      title: 'Ayah Reminder 🤲',
      body: message,
      icon: '/favicon.ico',
      tag: 'reminder',
      data: {
        type: 'reminder',
        timestamp: Date.now()
      }
    });
  }

  public async schedulePrayerReminders(): Promise<void> {
    // This would integrate with prayer time APIs
    const prayerTimes = [
      { name: 'Fajr', time: '05:30' },
      { name: 'Sunrise', time: '07:00' },
      { name: 'Dhuhr', time: '12:30' },
      { name: 'Asr', time: '15:45' },
      { name: 'Maghrib', time: '18:20' },
      { name: 'Isha', time: '19:50' }
    ];

    // Schedule notifications for each prayer time
    prayerTimes.forEach(prayer => {
      this.schedulePrayerNotification(prayer.name, prayer.time);
    });
  }

  private schedulePrayerNotification(prayerName: string, time: string) {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (prayerTime <= now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    const timeUntilPrayer = prayerTime.getTime() - now.getTime();

    setTimeout(async () => {
      await this.sendReminderNotification(
        `${prayerName} prayer time. Remember Allah with today's verse.`
      );
    }, timeUntilPrayer);
  }

  public clearNotificationsByTag(tag: string): void {
    if (this.registration && 'getNotifications' in this.registration) {
      this.registration.getNotifications({ tag }).then(notifications => {
        notifications.forEach(notification => notification.close());
      });
    }
  }

  public async getAllNotifications(): Promise<Notification[]> {
    if (this.registration && 'getNotifications' in this.registration) {
      return await this.registration.getNotifications();
    }
    return [];
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Service Worker message handling for notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
      // Handle notification clicks
      const data = event.data.notificationData;
      
      if (data.type === 'daily-verse') {
        // Navigate to main app
        window.location.href = '/';
      } else if (data.type === 'wallpaper-ready') {
        // Show wallpaper customization
        window.location.href = '/customize';
      }
    }
  });
}