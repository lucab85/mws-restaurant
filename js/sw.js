var staticCacheName = 'nws-restaurant-stage-1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/js/sw.js',
        '/css/styles.css',
        '/css/responsive.css',
        '/data/restaurants.json',
        'https://normalize-css.googlecode.com/svn/trunk/normalize.css',
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDxzfjJXaXED2RoCNrW8HtRv7bkHngNP8g'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('nws-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.info('Event: Fetch');
  console.log(event.request);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
