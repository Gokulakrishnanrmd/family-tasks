/* Family Tasks service worker — offline shell caching */
const CACHE = 'familytasks-v2.0';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  // never cache Firebase / translation API — always go to network
  if (url.includes('firestore') || url.includes('googleapis') || url.includes('gstatic') || url.includes('mymemory')) return;
  // HTML/navigation: network-first so newest version loads when online; cache fallback offline
  if (e.request.mode === 'navigate' || url.endsWith('/') || url.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
        .catch(() => caches.match(e.request).then(h => h || caches.match('./index.html')))
    );
    return;
  }
  // other assets: cache-first
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (e.request.method === 'GET' && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
