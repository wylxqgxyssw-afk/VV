// 极简 Service Worker —— 让 PWA 获得全屏安装资格
const CACHE_NAME = 'plan-pwa-v1';

// 需要离线缓存的页面（这里只缓存首页）
const urlsToCache = [
  './',
  './index.html'
];

// 安装事件：预先缓存首页
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // 强制跳过等待，让新的 SW 立即激活
  self.skipWaiting();
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  // 让 SW 立即控制所有客户端
  self.clients.claim();
});

// 请求拦截：网络优先，失败时回退到缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});