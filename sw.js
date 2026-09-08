// Service Worker — Pronos entre potes
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(data.title || '⚽ Pronos entre potes', {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-32.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'pronos'
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});
