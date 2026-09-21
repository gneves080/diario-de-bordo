const CACHE_NAME = 'diario-de-bordo-v2';
const APP_SHELL = [
  './',
  './index.html',
  './style.min.css',
  './script.min.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request).then((networkResponse) => {
      const responseCopy = networkResponse.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
      return networkResponse;
    }).catch(() => caches.match('./index.html')))
  );
});
