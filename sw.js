const CACHE_NAME = 'plan-static-v1';
// 只缓存图标文件
const STATIC_CACHE_URLS = [
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // 对于图标请求，尝试从缓存返回
  if (STATIC_CACHE_URLS.some(staticUrl => event.request.url.includes(staticUrl))) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
    return;
  }
  // 其他所有请求（HTML、JS、JSON、API等）一律走网络，不缓存
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
);