// Service Worker for daily verse automation and background processing

const CACHE_NAME = 'ayah-wallpaper-v1';
const WALLPAPER_CACHE = 'wallpaper-cache-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Background sync for daily updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'daily-verse-update') {
    event.waitUntil(processDailyUpdate());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New daily verse available',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'daily-verse',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Daily Verse 📖', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  let url = '/';
  
  if (data && data.type === 'wallpaper-ready') {
    url = '/customize';
  } else if (data && data.type === 'daily-verse') {
    url = '/';
  }

  event.waitUntil(
    clients.matchAll().then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'WIDGET_UPDATE') {
    // Handle widget updates
    console.log('Widget update requested');
    event.waitUntil(updateWidget(event.data.config));
  } else if (event.data && event.data.type === 'DAILY_UPDATE') {
    // Handle daily verse updates
    console.log('Daily update requested');
    event.waitUntil(processDailyUpdate());
  }
});

// Daily update processing
async function processDailyUpdate() {
  try {
    console.log('Processing daily verse update');
    
    // This would integrate with the main app's automation system
    // For now, we'll just log the process
    
    // In a real implementation, this would:
    // 1. Fetch a new verse from the database
    // 2. Generate wallpaper if needed
    // 3. Send notifications
    // 4. Update cached data
    
    return true;
  } catch (error) {
    console.error('Daily update failed:', error);
    return false;
  }
}

// Widget update processing
async function updateWidget(config) {
  try {
    console.log('Updating widget with config:', config);
    
    // This would update native widgets
    // Platform-specific implementation would go here
    
    return true;
  } catch (error) {
    console.error('Widget update failed:', error);
    return false;
  }
}

// Cache management for wallpapers
self.addEventListener('fetch', (event) => {
  // Cache wallpaper assets
  if (event.request.url.includes('wallpaper') || event.request.url.includes('assets')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(WALLPAPER_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});