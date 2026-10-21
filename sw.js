const CACHE = 'hub-v11';
// Relative to this service worker's location (/my-hub/), so it works on a GitHub project page
const PRECACHE = [
  './',
  'index.html',
  'dashboards/ledger.html',
  'dashboards/one-on-one-hub.html',
  'dashboards/first-101.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // add() each individually so one failure can't abort the whole install
      .then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Pages: network-first (always get the latest HTML when online, fall back to cache offline).
// Everything else: cache-first.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isPage = req.mode === 'navigate' || req.destination === 'document';
  if (isPage) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }
  e.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
