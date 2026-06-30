const CACHE = 'hub-v9';
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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
