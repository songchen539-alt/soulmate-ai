// PWA Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', (e) => {
  // Network first, cache fallback for offline
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request)
    })
  )
})
