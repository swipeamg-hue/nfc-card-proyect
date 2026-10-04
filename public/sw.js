// TapCard PWA Service Worker for Mobile NFC Digital Cards
const CACHE_NAME = 'tapcard-pwa-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== 'tapcard-manifest-cache') {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Intercept manifest requests so dynamically generated client manifests are served locally
  if (url.includes('/api/manifest/') || url.includes('manifest.json') || url.includes('.webmanifest')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(event.request).catch(() => {
          return new Response(JSON.stringify({ name: 'Tarjeta Digital NFC' }), {
            headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
          });
        });
      })
    );
    return;
  }

  // Pass-through network-first strategy for public cards & Supabase realtime data
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
