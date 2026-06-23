// Firebase Cloud Messaging Service Worker
// This file is served from /public and runs in the browser background context.
// It handles background push notifications when the app tab is not focused.

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

// NOTE: These values are injected at runtime via a /api/sw-config endpoint or
// replaced by the build step. For now, firebase-messaging-sw.js reads from
// self.__FIREBASE_CONFIG__ set by the main app's service worker registration.
// Fallback to empty strings — the SW still loads without crashing.
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY || '',
  authDomain: self.FIREBASE_AUTH_DOMAIN || '',
  projectId: self.FIREBASE_PROJECT_ID || '',
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: self.FIREBASE_APP_ID || '',
})

const messaging = firebase.messaging()

// Handle background messages (when tab is not focused)
messaging.onBackgroundMessage((payload) => {
  const notifData = payload.notification || {}
  const title = notifData.title || 'VEIXON Co-founders'
  const body = notifData.body || 'VZN has a message for you.'
  const icon = notifData.icon || '/vzn-icon.png'
  const data = payload.data || {}

  self.registration.showNotification(title, {
    body,
    icon,
    badge: '/vzn-badge.png',
    data,
    actions: [
      { action: 'open', title: 'Open VISIONIX' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    requireInteraction: true,
    tag: data.tag || 'visionix-notification',
  })
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'dismiss') return

  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
