const VERSION = 'v1';
const STATIC_CACHE = `fieldglass-static-${VERSION}`;
const PAGES_CACHE = `fieldglass-pages-${VERSION}`;
const OFFLINE_URL = '/offline';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then(cache => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== PAGES_CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          event.waitUntil(
            caches.open(PAGES_CACHE).then(cache => cache.put(request, copy))
          );
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then(cached => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname === '/logo.svg' ||
    /^\/(android-chrome|apple-touch-icon|favicon-)/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(
        cached =>
          cached ||
          fetch(request).then(response => {
            const copy = response.clone();
            event.waitUntil(
              caches.open(STATIC_CACHE).then(cache => cache.put(request, copy))
            );
            return response;
          })
      )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        event.waitUntil(
          caches.open(PAGES_CACHE).then(cache => cache.put(request, copy))
        );
        return response;
      })
      .catch(() => caches.match(request))
  );
});
