/* Nutrio service worker — temel varlıkları önbelleğe alır, offline shell sağlar.
   Strateji:
   - App shell (index.html, style.css, besinler.js, app.js, ikonlar, manifest): cache-first, arka planda güncellenir.
   - Google Fonts: stale-while-revalidate.
   - Kapsam dışı her GET isteği: ağ, müdahale edilmez.
   Her dağıtımda eski önbelleği geçersiz kılmak için CACHE_VERSION değerini artır. */
const CACHE_VERSION = 'nutrio-v3';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './besinler.js',
    './app.js',
    './manifest.json',
    './icon.svg',
    './icon-maskable.svg',
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-192.png',
    './icon-maskable-512.png'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    // Google Fonts: stale-while-revalidate
    if (FONT_HOSTS.some((host) => url.hostname === host)) {
        event.respondWith(
            caches.open(CACHE_VERSION).then(async (cache) => {
                const cached = await cache.match(request);
                const network = fetch(request).then((response) => {
                    if (response && response.ok) cache.put(request, response.clone());
                    return response;
                }).catch(() => cached);
                return cached || network;
            })
        );
        return;
    }

    // App shell (aynı origin): cache-first, arka planda tazelenir
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.open(CACHE_VERSION).then(async (cache) => {
                const cached = await cache.match(request, { ignoreSearch: request.url.endsWith('index.html') || request.url.endsWith('/') });
                const network = fetch(request).then((response) => {
                    if (response && response.ok) cache.put(request, response.clone());
                    return response;
                }).catch(() => null);
                if (cached) {
                    event.waitUntil(network);
                    return cached;
                }
                const fresh = await network;
                if (fresh) return fresh;
                // Offline: gezinme istekleri için shell'i döndür
                if (request.mode === 'navigate') {
                    const shell = await cache.match('./index.html');
                    if (shell) return shell;
                }
                return new Response('', { status: 504, statusText: 'Offline' });
            })
        );
    }
});
