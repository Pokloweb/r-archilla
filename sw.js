// Service worker de R Archilla: la app funciona sin conexión y R (webR) se guarda
// en caché tras la primera carga, así que también se puede practicar código offline.
const VERSION = 'ra-2026-10-08-1';
const SHELL = `shell-${VERSION}`;
const RUNTIME = 'runtime-v1'; // webR, paquetes de R y fuentes: no cambian entre versiones de la app

const SHELL_FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css',
  'js/ui.js', 'js/app.js', 'js/r-engine.js', 'js/trace.js',
  'js/content/u2.js', 'js/content/u3.js', 'js/content/u4.js', 'js/content/u5.js', 'js/content/ex1.js',
  'js/content/u6.js', 'js/content/u7.js', 'js/content/u8.js', 'js/content/ex2.js', 'js/content/bugs.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];
const RUNTIME_HOSTS = ['webr.r-wasm.org', 'repo.r-wasm.org', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL)
      .then((c) => Promise.all(SHELL_FILES.map((f) => c.add(f).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('shell-') && k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Ficheros propios: primero la red (para recibir actualizaciones), si falla, la caché.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // webR, paquetes y fuentes: primero la caché (son ficheros versionados que no cambian).
  if (RUNTIME_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(RUNTIME).then((cache) =>
        cache.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok && (res.type === 'cors' || res.type === 'basic')) cache.put(req, res.clone());
          return res;
        }))
      )
    );
  }
});
