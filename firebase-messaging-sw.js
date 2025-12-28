/* firebase-messaging-sw.js */

// استقبال رسائل Push من Firebase
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const n = data.notification || {};
  const d = data.data || {};

  const title = n.title || '🔔 تنبيه التذكير';
  const body  = n.body  || d.body || 'حان وقت التذكير';
  const icon  = n.icon  || '/icon.png'; // يمكنك وضع أيقونة بجانب الملفات

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      tag: n.tag || d.id || Date.now().toString(),
      data: { url: d.url || '/', ...d },
      vibrate: [200, 100, 200]
    })
  );
});

// عند الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(winClients => {
      for (const client of winClients) {
        const target = new URL(url, self.location.origin).pathname;
        const current = new URL(client.url).pathname;
        if (current === target) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
