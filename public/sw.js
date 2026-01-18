const CACHE_NAME = 'panorama-v2.2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/img/favicon.png',
  '/sw.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html') || request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        const resCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, resCopy);
        });
        return response;
      }).catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        fetch(request).then((response) => {
          const resCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, resCopy);
          });
        }).catch(() => {});
        return cached;
      }
      return fetch(request).then((response) => {
        const resCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, resCopy);
        });
        return response;
      }).catch(() => {});
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});