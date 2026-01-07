const CACHE_NAME = 'rodada-dgrau-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/lucide-react@^0.555.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/@google/genai@^1.30.0',
  'https://aistudiocdn.com/react@^19.2.0/',
  'https://aistudiocdn.com/react@^19.2.0'
];

// Install event: cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network first, fall back to cache for HTML/API. Cache first for static assets.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For external images (logos), try cache, then network, but don't fail hard
  if (url.protocol.startsWith('http') && (url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'))) {
     event.respondWith(
        caches.match(event.request).then((response) => {
           return response || fetch(event.request).then(fetchRes => {
               return caches.open(CACHE_NAME).then(cache => {
                   cache.put(event.request, fetchRes.clone());
                   return fetchRes;
               });
           }).catch(() => {
               // Return nothing or a placeholder if offline and image not cached
               return new Response('', { status: 404 }); 
           });
        })
     );
     return;
  }

  // General Strategy: Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache with new response
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      }).catch(() => {
          // Network failed
      });

      return cachedResponse || fetchPromise;
    })
  );
});