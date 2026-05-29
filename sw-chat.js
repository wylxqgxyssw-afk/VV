const CACHE_NAME = 'chat-cache-v2';
self.addEventListener('install', event => {
  console.log('SW 安装');
  self.skipWaiting(); // 立即激活
});
self.addEventListener('activate', event => {
  event.waitUntil(
    clients.claim().then(() => {
      // 可清理旧缓存
      return caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      });
    })
  );
});
// 网络优先，失败才用缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});