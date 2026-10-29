/* Caches this site only. Other websites, including the AI render service, are left alone. */
const CACHE = 'gerts-reno-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

function networkFirst(request) {
  return (async () => {
    const cache = await caches.open(CACHE);
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const home = await caches.match('index.html');
        if (home) return home;
      }
      throw err;
    }
  })();
}

function cacheFirst(request) {
  return (async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, fresh.clone());
    }
    return fresh;
  })();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  let url;
  try { url = new URL(request.url); } catch { return; }
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  if (path.endsWith('/sw.js')) return;
  const doc = request.mode === 'navigate'
    || path.endsWith('/index.html')
    || path.endsWith('/catalogue.json')
    || path.endsWith('/gallery.json')
    || path.endsWith('/faq-facts.json')
    || path.endsWith('/about.html')
    || path.endsWith('/handover.html')
    || path.endsWith('/');
  if (doc || path.endsWith('.js') || path.endsWith('.webmanifest')) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (path.includes('/assets/')) event.respondWith(cacheFirst(request));
});
