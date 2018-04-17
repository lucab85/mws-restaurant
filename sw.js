var staticCacheName = 'mws-restaurant';
let fileToCache = [
  'index.html',
  'restaurant.html',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'sw.js',
  'css/styles.css',
  'css/responsive.css',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg'
];

self.addEventListener('install', function(event) {
  console.log('service worker installed');
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log('serviceWorker is caching app shell');
      return cache.addAll(fileToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('nws-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      ).then(() => { console.log('Service worker active');} );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.info('Event: Fetch');
  console.log(event.request);
  event.respondWith(fromCache(event.request).catch((error) => {
    console.log(error);
  }));
  event.waitUntil(update(event.request));
});

function fromCache(request) {
  return caches.open(staticCacheName).then(function(cache) {
    return cache.match(request).then(function (matching) {
      return matching || fetch(request);
    });
  });
}

function update(request) {
  return caches.open(staticCacheName).then(function(cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
