const CACHE_NAME = 'sajhi-shiksha-runtime-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/image.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Only intercept GET requests
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Cache same-origin assets, Google Fonts, and local data runtime when visited
    const isSameOrigin = url.origin === self.location.origin;
    const isGoogleFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
    const isCachableAsset = (
        request.destination === 'document' ||
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'image' ||
        request.destination === 'font' ||
        url.pathname.endsWith('.json') ||
        url.pathname.includes('/assets/')
    );

    if ((isSameOrigin || isGoogleFont) && isCachableAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Offline support: return cached response if offline
                        return cachedResponse;
                    });

                    // Stale-While-Revalidate: Return cache immediately, fetch in background
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
